import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'

/**
 * POST /api/tests/submit
 * Receives student test responses, scores them server-side, and stores results in user document
 * 
 * degreeExplorer (10th+): interests, personality, aptitude, workValues, eq (5 tests, 260 items, 110 min)
 * streamSelector (<10th): interests, personality, aptitude, selfEfficacy (4 tests, 284 items, 110 min)
 * 
 * Request body:
 * {
 *   testType: 'degreeExplorer' | 'streamSelector',
 *   section: section appropriate for testType (see above),
 *   moduleId: 'career-interests' | 'personality' | etc,
 *   responses: { questionId: answer, ... },
 *   timeSpent: number (milliseconds)
 * }
 * 
 * Returns:
 * {
 *   success: true,
 *   message: 'Test submitted and scored successfully',
 *   result: { testType, section, scores, completedAt }
 * }
 */

// Valid sections for each test type
const VALID_SECTIONS = {
  degreeExplorer: ['interests', 'personality', 'aptitude', 'workValues', 'eq'],
  streamSelector: ['interests', 'personality', 'aptitude', 'selfEfficacy'],
}
export async function POST(request) {
  try {
    // 1. Verify auth token
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing auth token' }, { status: 401 })
    }

    let decoded
    try {
      decoded = await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('[submit] Token verification failed:', error.message)
      return NextResponse.json({ error: 'Invalid or expired auth token' }, { status: 401 })
    }

    // 2. Parse request body
    const { testType, section, moduleId, responses, timeSpent } = await request.json()

    if (!testType || !section || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields: testType, section, responses' },
        { status: 400 }
      )
    }

    // 2b. Validate section is valid for this test type
    const allowedSections = VALID_SECTIONS[testType]
    if (!allowedSections) {
      return NextResponse.json(
        { error: `Invalid testType: ${testType}. Must be 'degreeExplorer' or 'streamSelector'` },
        { status: 400 }
      )
    }
    if (!allowedSections.includes(section)) {
      return NextResponse.json(
        { error: `Invalid section '${section}' for testType '${testType}'. Allowed: ${allowedSections.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('[submit] Test submission:', {
      userId: decoded.uid,
      testType,
      section,
      numResponses: Object.keys(responses).length,
      timeSpent,
    })

    // 3. Fetch question bank data with scoring config
    const docName = section === 'aptitude' || section === 'selfEfficacy' ? 'config' : 'items'
    let questionData
    try {
      const snap = await adminDb
        .collection('questionBank')
        .doc(testType)
        .collection(section)
        .doc(docName)
        .get()

      if (!snap.exists) {
        throw new Error(`Question bank not found: ${testType}/${section}/${docName}`)
      }

      questionData = snap.data()
    } catch (error) {
      console.error('[submit] Error fetching question data:', error.message)
      return NextResponse.json({ error: 'Failed to fetch scoring data' }, { status: 500 })
    }

    // 4. Score the responses server-side
    const sectionResult = scoreTestSection(section, responses, questionData)

    if (!sectionResult.success) {
      return NextResponse.json({ error: sectionResult.error }, { status: 400 })
    }

    console.log('[submit] Test scored:', {
      userId: decoded.uid,
      section,
      scores: sectionResult.data,
    })

    // 5. Update user document with results in a single write
    const resultFieldName = `${testType}Result`
    const updateData = {
      [resultFieldName]: {
        ...((await adminDb.collection('users').doc(decoded.uid).get()).data()?.[resultFieldName] || {}),
        [section]: {
          responses, // Store raw responses
          scores: sectionResult.data,
          completedAt: new Date(),
          timeSpent,
        },
      },
      completedAt: new Date(),
      notCompleted: false,
    }

    await adminDb.collection('users').doc(decoded.uid).update(updateData)

    console.log('[submit] Results saved to user document:', {
      userId: decoded.uid,
      field: resultFieldName,
      section,
    })

    return NextResponse.json({
      success: true,
      message: 'Test submitted and scored successfully',
      result: {
        testType,
        section,
        scores: sectionResult.data,
        completedAt: updateData.completedAt,
      },
    })
  } catch (error) {
    console.error('[submit] Unexpected error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Score a test section based on question data and user responses
 * Returns: { success: boolean, data?: scores, error?: string }
 */
function scoreTestSection(section, responses, questionData) {
  try {
    if (section === 'interests') {
      return scoreInterests(responses, questionData)
    } else if (section === 'personality') {
      return scorePersonality(responses, questionData)
    } else if (section === 'aptitude') {
      return scoreAptitude(responses, questionData)
    } else if (section === 'workValues') {
      return scoreWorkValues(responses, questionData)
    } else if (section === 'eq') {
      return scoreEQ(responses, questionData)
    } else if (section === 'selfEfficacy') {
      return scoreSelfEfficacy(responses, questionData)
    } else {
      return { success: false, error: `Unknown section: ${section}` }
    }
  } catch (error) {
    console.error('[scoreTestSection] Error:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Score Interests section
 * Calculates RIASEC scores from Likert and Forced Choice items
 */
function scoreInterests(responses, questionData) {
  const { likertItems, forcedChoiceItems, scoringConfig } = questionData

  if (!scoringConfig) {
    return { success: false, error: 'Scoring config not found in question bank' }
  }

  // Initialize cluster raw scores
  const clusterRaw = {}
  if (likertItems) {
    likertItems.forEach((item) => {
      const cluster = item.cluster
      if (!clusterRaw[cluster]) clusterRaw[cluster] = 0

      const response = parseInt(responses[item.id], 10) || 0
      const score = item.reversed ? 6 - response : response
      clusterRaw[cluster] += score
    })
  }

  // Add forced choice points
  if (forcedChoiceItems) {
    forcedChoiceItems.forEach((item) => {
      const answer = responses[item.id] // 'A' or 'B'
      if (answer === 'A') {
        if (!clusterRaw[item.clusterA]) clusterRaw[item.clusterA] = 0
        clusterRaw[item.clusterA] += 2
      } else if (answer === 'B') {
        if (!clusterRaw[item.clusterB]) clusterRaw[item.clusterB] = 0
        clusterRaw[item.clusterB] += 2
      }
    })
  }

  // Rescale to 1-9 scale
  const clusterRescaled = {}
  Object.entries(clusterRaw).forEach(([cluster, raw]) => {
    clusterRescaled[cluster] = 1 + ((raw - 4) / 18) * 8
  })

  // Calculate RIASEC scores (for degreeExplorer)
  let riasecScores = null
  if (scoringConfig.riasecWeights) {
    riasecScores = {}
    Object.keys(scoringConfig.riasecWeights).forEach((code) => {
      let weightedSum = 0
      const weights = scoringConfig.riasecWeights[code]

      Object.entries(weights).forEach(([cluster, weight]) => {
        if (clusterRescaled[cluster]) {
          weightedSum += clusterRescaled[cluster] * weight
        }
      })

      const maxWeight = Object.values(weights).reduce((a, b) => a + b, 0)
      riasecScores[code] = (weightedSum / maxWeight) * 9
    })
  }

  // Calculate stream scores (for streamSelector)
  let streamScores = null
  if (scoringConfig.streamWeights) {
    streamScores = {}
    Object.keys(scoringConfig.streamWeights).forEach((stream) => {
      let score = 0
      const weights = scoringConfig.streamWeights[stream]

      Object.entries(weights).forEach(([cluster, weight]) => {
        if (clusterRescaled[cluster]) {
          score += clusterRescaled[cluster] * weight
        }
      })

      streamScores[stream] = score
    })
  }

  return {
    success: true,
    data: {
      clusterRaw,
      clusterRescaled,
      riasecScores,
      streamScores,
    },
  }
}

/**
 * Score Personality section
 * Works for both degreeExplorer (uses regular weights) and streamSelector (uses streamPersonalityWeights)
 */
function scorePersonality(responses, questionData) {
  const { likertItems, scenarioItems, streamPersonalityWeights } = questionData

  const traitScores = {}

  // Score Likert items
  if (likertItems) {
    likertItems.forEach((item) => {
      const trait = item.trait
      if (!traitScores[trait]) traitScores[trait] = { likert: 0, scenario: 0, count: 0 }

      const response = parseInt(responses[item.id], 10) || 0
      const score = item.reversed ? 6 - response : response
      traitScores[trait].likert += score
      traitScores[trait].count += 1
    })
  }

  // Score scenario items
  if (scenarioItems) {
    scenarioItems.forEach((item) => {
      const trait = item.trait
      if (!traitScores[trait]) traitScores[trait] = { likert: 0, scenario: 0, count: 0 }

      const answer = responses[item.id] // 'A', 'B', or 'C'
      const scoreMap = { A: 3, B: 2, C: 1 }
      traitScores[trait].scenario += scoreMap[answer] || 0
    })
  }

  // Calculate rescaled scores (1-9)
  const rescaledScores = {}
  Object.entries(traitScores).forEach(([trait, data]) => {
    const avg = (data.likert + data.scenario) / (data.count + 1)
    rescaledScores[trait] = 1 + ((avg - 1) / 4) * 8
  })

  // If streamPersonalityWeights exist (streamSelector), apply them
  let streamScores = null
  if (streamPersonalityWeights) {
    streamScores = {}
    Object.keys(streamPersonalityWeights).forEach((stream) => {
      let score = 0
      const weights = streamPersonalityWeights[stream]
      Object.entries(weights).forEach(([trait, weight]) => {
        if (rescaledScores[trait]) {
          score += rescaledScores[trait] * weight
        }
      })
      streamScores[stream] = score
    })
  }

  return {
    success: true,
    data: {
      traitRaw: traitScores,
      traitRescaled: rescaledScores,
      streamScores,
    },
  }
}

/**
 * Score Aptitude section
 * Works for both degreeExplorer (maps to stanines via onetWeights) and streamSelector (uses streamAptitudeWeights)
 */
function scoreAptitude(responses, questionData) {
  const { subtests, stanineTable, onetWeights, streamAptitudeWeights } = questionData

  if (!subtests) {
    return { success: false, error: 'Missing subtests in aptitude scoring data' }
  }

  const subtestScores = {}

  subtests.forEach((subtest) => {
    let correctCount = 0
    subtest.items.forEach((item) => {
      if (responses[item.id] === item.correctAnswer) {
        correctCount++
      }
    })

    const rawScore = correctCount
    const zScore = (rawScore - subtest.mean) / subtest.stdDev

    subtestScores[subtest.name] = {
      raw: rawScore,
      zScore,
    }

    // For degreeExplorer: map to stanines
    if (stanineTable) {
      const stanine = getStanineFromZScore(zScore, stanineTable)
      subtestScores[subtest.name].stanine = stanine
    }
  })

  // For streamSelector: apply streamAptitudeWeights
  let streamScores = null
  if (streamAptitudeWeights) {
    streamScores = {}
    Object.keys(streamAptitudeWeights).forEach((stream) => {
      let score = 0
      const weights = streamAptitudeWeights[stream]
      Object.entries(weights).forEach(([subtest, weight]) => {
        if (subtestScores[subtest] && subtestScores[subtest].zScore !== undefined) {
          score += subtestScores[subtest].zScore * weight
        }
      })
      streamScores[stream] = score
    })
  }

  return {
    success: true,
    data: {
      subtestScores,
      streamScores,
    },
  }
}

/**
 * Score Work Values section
 */
function scoreWorkValues(responses, questionData) {
  const { scenarios } = questionData

  const valueScores = {}

  if (scenarios) {
    scenarios.forEach((scenario) => {
      const most = responses[`${scenario.id}_most`]
      const least = responses[`${scenario.id}_least`]

      Object.keys(scenario.options).forEach((value) => {
        if (!valueScores[value]) valueScores[value] = 0

        if (most === value) valueScores[value] += 2
        if (least === value) valueScores[value] -= 1
      })
    })
  }

  // Rescale to 1-9
  const rescaledScores = {}
  Object.entries(valueScores).forEach(([value, raw]) => {
    rescaledScores[value] = 1 + ((raw + 6) / 18) * 8
  })

  return {
    success: true,
    data: {
      valueRaw: valueScores,
      valueRescaled: rescaledScores,
    },
  }
}

/**
 * Score EQ section
 */
function scoreEQ(responses, questionData) {
  const { likertItems, scenarioItems } = questionData

  const factorScores = {}

  if (likertItems) {
    likertItems.forEach((item) => {
      const factor = item.factor
      if (!factorScores[factor]) factorScores[factor] = { likert: 0, scenario: 0, count: 0 }

      const response = parseInt(responses[item.id], 10) || 0
      const score = item.reversed ? 6 - response : response
      factorScores[factor].likert += score
      factorScores[factor].count += 1
    })
  }

  if (scenarioItems) {
    scenarioItems.forEach((item) => {
      const factor = item.factor
      if (!factorScores[factor]) factorScores[factor] = { likert: 0, scenario: 0, count: 0 }

      const answer = responses[item.id]
      const scoreMap = { A: 3, B: 2, C: 1 }
      factorScores[factor].scenario += scoreMap[answer] || 0
    })
  }

  const rescaledScores = {}
  Object.entries(factorScores).forEach(([factor, data]) => {
    const avg = (data.likert + data.scenario) / (data.count + 1)
    rescaledScores[factor] = 1 + ((avg - 1) / 4) * 8
  })

  return {
    success: true,
    data: {
      factorRaw: factorScores,
      factorRescaled: rescaledScores,
    },
  }
}

/**
 * Score Self Efficacy section (streamSelector only)
 * Calculates stream-based self-efficacy scores
 */
function scoreSelfEfficacy(responses, questionData) {
  const { likertItems, streamWeights } = questionData

  if (!streamWeights) {
    return { success: false, error: 'Stream weights not found in self-efficacy config' }
  }

  // Score likert items by dimension (if available)
  const dimensionScores = {}
  if (likertItems) {
    likertItems.forEach((item) => {
      const dimension = item.dimension
      if (!dimensionScores[dimension]) dimensionScores[dimension] = 0

      const response = parseInt(responses[item.id], 10) || 0
      const score = item.reversed ? 6 - response : response
      dimensionScores[dimension] += score
    })
  }

  // Calculate stream scores using streamWeights
  const streamScores = {}
  Object.keys(streamWeights).forEach((stream) => {
    let score = 0
    const weights = streamWeights[stream]

    Object.entries(weights).forEach(([dimension, weight]) => {
      if (dimensionScores[dimension]) {
        score += dimensionScores[dimension] * weight
      }
    })

    streamScores[stream] = score
  })

  return {
    success: true,
    data: {
      dimensionRaw: dimensionScores,
      streamScores,
    },
  }
}

/**
 * Convert z-score to stanine using the stanine table
 */
function getStanineFromZScore(zScore, stanineTable) {
  for (const [stanine, range] of Object.entries(stanineTable)) {
    if (zScore >= range.min && zScore <= range.max) {
      return parseInt(stanine)
    }
  }
  return 5 // default to middle stanine if not found
}
