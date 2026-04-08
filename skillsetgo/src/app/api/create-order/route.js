import { NextResponse } from 'next/server'
import razorpay from '@/lib/razorpay'
import { normalizeTier, getPriceForTier } from '@/lib/pricing'
import { adminAuth } from '@/lib/firebaseAdmin'
import { db } from '@/lib/firebaseAdmin'

/**
 * POST /api/create-order
 * Creates a Razorpay order for payment
 * 
 * SECURITY:
 * - Verifies Firebase auth token
 * - Accepts ONLY tier from frontend (never price)
 * - Recalculates price server-side from hardcoded config
 * - Ignores any price data sent from frontend
 * - For degree_explorer: fetches student's class from Firestore for accurate pricing
 * 
 * Request body: 
 * {
 *   tier: "stream_fit" | "degree_explorer" | "college_admission",
 *   sessions?: number (optional, only used for college_admission)
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

    // 2. Parse and validate request body
    const body = await req.json()
    const rawTier = body?.tier
    const sessions = body?.sessions

    // Sanitize tier - only accept valid tiers
    const tier = normalizeTier(rawTier)
    if (!tier) {
      return NextResponse.json(
        { error: 'Invalid or missing tier. Valid options: stream_fit, degree_explorer, college_admission' },
        { status: 400 }
      )
    }

    // 3. CRITICAL SECURITY: 
    // Backend ALWAYS recalculates amount from trusted config
    // Any price sent from frontend is completely ignored
    // For degree_explorer, fetch student's class from Firestore for accurate pricing
    let studentClass = null
    if (tier === 'degree_explorer') {
      try {
        const userDoc = await db.collection('users').doc(decoded.uid).get()
        if (userDoc.exists) {
          studentClass = userDoc.data()?.class
        }
      } catch (error) {
        console.warn('[create-order] Could not fetch student class:', error)
        // Continue with null class - pricing will default to senior rate (₹699)
      }
    }

    const amount = getPriceForTier(tier, studentClass, sessions)

    console.log(
      `[create-order] OrderCreation initiated:`,
      { userId: decoded.uid, tier, class: studentClass, sessions, amount }
    )

    // 4. Create Razorpay order with backend-calculated amount
    // Receipt must be <= 40 characters
    const receipt = `${decoded.uid.slice(0, 20)}_${Date.now().toString().slice(-8)}`
    
    const order = await razorpay.orders.create({
      amount, // in paise
      currency: 'INR',
      receipt,
      notes: {
        tier,
        userId: decoded.uid,
      },
    })

    console.log(`[create-order] Order created:`, { orderId: order.id, amount })

    // 5. Return order along with Razorpay key
    return NextResponse.json({
      success: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      tier,
    })
  } catch (error) {
    console.error('[create-order] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
