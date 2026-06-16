import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

/**
 * GET /api/user/profile
 * Fetches the authenticated user's profile from Firestore
 * 
 * Returns: User data including class, tier, email, phone, etc.
 */
export async function GET(request) {
  try {
    // 1. Verify authentication token
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing auth token' }, { status: 401 })
    }

    let decoded
    try {
      decoded = await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('[user-profile] Token verification failed:', error.message)
      return NextResponse.json({ error: 'Invalid or expired auth token' }, { status: 401 })
    }

    // 2. Fetch user profile from Firestore
    let userDoc
    try {
      userDoc = await adminDb.collection('users').doc(decoded.uid).get()

      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
      }
    } catch (error) {
      console.error('[user-profile] Error fetching user document:', error.message)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const userData = userDoc.data()

    console.log('[user-profile] Profile fetched:', { userId: decoded.uid, class: userData.class })

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.uid,
        email: userData.email,
        name: userData.name,
        class: userData.class, // e.g., '10', '12'
        phone: userData.phone,
        tier: userData.tier || userData.purchasedTier,
        institution: userData.institution,
        dateOfBirth: userData.dateOfBirth,
      },
    })
  } catch (error) {
    console.error('[user-profile] Unexpected error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
