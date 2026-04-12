import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

/**
 * GET /api/tests/questions
 * Fetches a specific test section from the question bank.
 * 
 * SECURITY:
 * - Verifies Firebase auth token
 * - Validates user has paid access to the test tier
 * - Only fetches requested section (never all sections)
 * - Strips all scoring configs, weights, and answer keys before returning to client
 * 
 * Query parameters:
 * - test: 'degreeExplorer' or 'streamSelector' (required)
 * - section: 'interests', 'personality', 'aptitude', 'workValues', 'eq', 'selfEfficacy' (required)
 * 
 * Response: Safe question data with scoringConfig removed
 */
export async function GET(request) {
  try {
    // 1. Extract and verify authentication token
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing auth token' }, { status: 401 })
    }

    let decoded
    try {
      decoded = await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('[questions] Token verification failed:', error.message)
      return NextResponse.json({ error: 'Invalid or expired auth token' }, { status: 401 })
    }

    // 2. Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('test')
    const section = searchParams.get('section')

    // Validate test type
    const validTestTypes = ['degreeExplorer', 'streamSelector']
    if (!testType || !validTestTypes.includes(testType)) {
      return NextResponse.json(
        { error: `Invalid test type. Must be one of: ${validTestTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate section
    const validSections = ['interests', 'personality', 'aptitude', 'workValues', 'eq', 'selfEfficacy']
    if (!section || !validSections.includes(section)) {
      return NextResponse.json(
        { error: `Invalid section. Must be one of: ${validSections.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify section is valid for the test type
    const allowedSections = {
      degreeExplorer: ['interests', 'personality', 'aptitude', 'workValues', 'eq'],
      streamSelector: ['interests', 'personality', 'aptitude', 'selfEfficacy'],
    }

    if (!allowedSections[testType].includes(section)) {
      return NextResponse.json(
        { error: `Section '${section}' is not available for test '${testType}'` },
        { status: 400 }
      )
    }

    // 3. Verify user has paid access to the requested test
    let userDoc
    try {
      userDoc = await adminDb.collection('users').doc(decoded.uid).get()
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
      }
    } catch (error) {
      console.error('[questions] Error fetching user:', error.message)
      return NextResponse.json({ error: 'Failed to verify access' }, { status: 500 })
    }

    const userData = userDoc.data()
    const userTier = userData?.tier || userData?.purchasedTier

    console.log('[questions] User data loaded:', { userId: decoded.uid, tier: userTier, class: userData?.class })

    // SPECIAL CASE: Interests test is FREE for all authenticated users
    const isFreeSection = section === 'interests'

    if (!isFreeSection && !userTier) {
      return NextResponse.json(
        {
          error: `Access denied. This test requires a subscription. Only the Interests test is free.`,
        },
        { status: 403 }
      )
    }

    // Map test types to required tiers
    const tierRequirements = {
      degreeExplorer: ['degree_explorer'],
      streamSelector: ['stream_fit', 'degree_explorer'], // stream_fit includes both tests
    }

    if (!isFreeSection && userTier && !tierRequirements[testType].includes(userTier)) {
      return NextResponse.json(
        {
          error: `Access denied. User tier '${userTier}' does not include '${testType}'.`,
        },
        { status: 403 }
      )
    }

    console.log('[questions] Access granted:', { section, isFree: isFreeSection, userTier })

    // 4. Fetch the requested section from questionBank
    // Document name: 'items' for most sections, 'config' for aptitude & selfEfficacy
    const docName = section === 'aptitude' || section === 'selfEfficacy' ? 'config' : 'items'

    let sectionData
    try {
      const snap = await adminDb
        .collection('questionBank')
        .doc(testType)
        .collection(section)
        .doc(docName)
        .get()

      if (!snap.exists) {
        console.warn(`[questions] Document not found: questionBank/${testType}/${section}/${docName}`)
        return NextResponse.json(
          { error: `Test section '${section}' not found in question bank` },
          { status: 404 }
        )
      }

      sectionData = snap.data()
    } catch (error) {
      console.error('[questions] Error fetching section:', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch test section' },
        { status: 500 }
      )
    }

    // 5. CRITICAL: Strip all sensitive configurations before sending to client
    const sensitiveFields = [
      'scoringConfig',
      'riasecWeights',
      'streamWeights',
      'streamPersonalityWeights',
      'onetWeights',
      'stanineTable',
      'answerKey',
      'answers',
    ]

    const safeData = { ...sectionData }
    sensitiveFields.forEach((field) => {
      delete safeData[field]
    })

    console.log(
      `[questions] Section fetched successfully:`,
      { userId: decoded.uid, testType, section, itemCount: Object.keys(safeData).length }
    )

    return NextResponse.json({
      success: true,
      data: safeData,
      metadata: {
        testType,
        section,
        fetchedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[questions] Unexpected error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
