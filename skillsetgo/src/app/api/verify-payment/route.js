import crypto from 'crypto'
import { NextResponse } from 'next/server'
import razorpay from '@/lib/razorpay'
import { normalizeTier, getPriceForTier } from '@/lib/pricing'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

/**
 * Timing-safe string comparison
 * Prevents timing attacks on signature verification
 * @param {string} a - Expected value
 * @param {string} b - Received value
 * @returns {boolean} - True if equal
 */
function safeEqual(a, b) {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

/**
 * POST /api/verify-payment
 * Verifies Razorpay payment and updates user subscription
 * 
 * SECURITY:
 * - Verifies Firebase auth token
 * - Validates tier
 * - Verifies Razorpay HMAC signature (timing-safe)
 * - Double-checks amount against backend config
 * - For degree_explorer: recalculates price using student's class from Firestore
 * - Verifies order ownership
 * - ONLY after all verification → stores in Firebase
 * - Updates user subscription status
 * 
 * Request body:
 * {
 *   tier: "stream_fit",
 *   razorpay_order_id: "order_xxx",
 *   razorpay_payment_id: "pay_xxx",
 *   razorpay_signature: "signature_xxx"
 * }
 */
export async function POST(req) {
  try {
    // 1. Verify user authentication
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let decoded
    try {
      decoded = await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 })
    }

    // 2. Parse request body
    const {
      tier: rawTier,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    // 3. Validate tier
    const tier = normalizeTier(rawTier)
    if (!tier) {
      return NextResponse.json(
        { error: 'Invalid or missing tier' },
        { status: 400 }
      )
    }

    // 4. Validate required payment fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      )
    }

    // 5. CRITICAL: Verify Razorpay signature server-side
    // This prevents payment tampering from frontend
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      console.error('[verify-payment] RAZORPAY_KEY_SECRET not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Calculate expected signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    // Timing-safe comparison to prevent signature forgery
    if (!safeEqual(expectedSignature, razorpay_signature)) {
      console.warn('[verify-payment] Signature mismatch:', {
        orderId: razorpay_order_id,
        userId: decoded.uid,
      })
      return NextResponse.json(
        { error: 'Payment verification failed: Invalid signature' },
        { status: 400 }
      )
    }

    console.log('[verify-payment] Signature verified:', { razorpay_order_id })

    // 6. Fetch student's class if needed for degree_explorer pricing
    let studentClass = null
    if (tier === 'degree_explorer') {
      try {
        const userDoc = await adminDb.collection('users').doc(decoded.uid).get()
        if (userDoc.exists) {
          studentClass = userDoc.data()?.class
        }
      } catch (error) {
        console.warn('[verify-payment] Could not fetch student class:', error)
        // Continue with null class - will use senior pricing
      }
    }

    // 7. Double-check: Fetch order from Razorpay and verify amount
    let order
    try {
      order = await razorpay.orders.fetch(razorpay_order_id)
    } catch (error) {
      console.error('[verify-payment] Failed to fetch order:', error)
      return NextResponse.json(
        { error: 'Failed to verify order with payment provider' },
        { status: 400 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found with payment provider' },
        { status: 400 }
      )
    }

    // 8. Verify amount matches backend config (recalculated with class info for degree_explorer)
    const expectedAmount = getPriceForTier(tier, studentClass)
    if (order.amount !== expectedAmount) {
      console.error('[verify-payment] Amount mismatch:', {
        orderId: razorpay_order_id,
        expected: expectedAmount,
        actual: order.amount,
        tier,
        class: studentClass,
      })
      return NextResponse.json(
        { error: 'Payment verification failed: Amount mismatch' },
        { status: 400 }
      )
    }

    // 9. Verify order ownership - prevent paying for someone else's order
    if (order.notes?.userId !== decoded.uid || order.notes?.tier !== tier) {
      console.warn('[verify-payment] Order ownership mismatch:', {
        orderId: razorpay_order_id,
        expectedUserId: decoded.uid,
        actualUserId: order.notes?.userId,
      })
      return NextResponse.json(
        { error: 'Payment verification failed: Order ownership mismatch' },
        { status: 403 }
      )
    }

    const timestamp = new Date().toISOString()

    // 9. ONLY AFTER successful verification → store payment in Firebase
    await adminDb.collection('payments').doc(razorpay_order_id).set({
      userId: decoded.uid,
      tier,
      amount: expectedAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'verified',
      provider: 'razorpay',
      currency: 'INR',
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    console.log('[verify-payment] Payment stored in Firebase:', {
      orderId: razorpay_order_id,
      userId: decoded.uid,
    })

    // 10. Update user profile with new subscription
    await adminDb.collection('users').doc(decoded.uid).update({
      subscription: {
        tier,
        status: 'active',
        provider: 'razorpay',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: expectedAmount,
        activatedAt: timestamp,
        updatedAt: timestamp,
      },
      updatedAt: timestamp,
    })

    console.log('[verify-payment] User subscription updated:', {
      userId: decoded.uid,
      tier,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[verify-payment] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
