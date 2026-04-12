/**
 * Client-side utility for fetching test sections
 * Handles auth token attachment and error handling
 */

/**
 * Fetch a test section from the server
 * @param {string} testType - 'degreeExplorer' or 'streamSelector'
 * @param {string} section - 'interests', 'personality', 'aptitude', 'workValues', 'eq', 'selfEfficacy'
 * @param {string} authToken - Firebase auth token from user session
 * @returns {Promise<Object>} Safe question data (scoring configs stripped server-side)
 */
export async function fetchTestSection(testType, section, authToken) {
  if (!authToken) {
    throw new Error('Authentication token required')
  }

  if (!testType || !section) {
    throw new Error('Test type and section are required')
  }

  const params = new URLSearchParams({
    test: testType,
    section: section,
  })

  try {
    const response = await fetch(`/api/tests/questions?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to fetch ${section} section (${response.status})`)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error(`[fetchTestSection] Error fetching ${testType}/${section}:`, error.message)
    throw error
  }
}

/**
 * Batch fetch multiple sections at once
 * @param {string} testType - 'degreeExplorer' or 'streamSelector'
 * @param {string[]} sections - Array of section names to fetch
 * @param {string} authToken - Firebase auth token
 * @returns {Promise<Object>} Object with section names as keys
 */
export async function fetchTestSections(testType, sections, authToken) {
  const results = {}
  const errors = {}

  for (const section of sections) {
    try {
      results[section] = await fetchTestSection(testType, section, authToken)
    } catch (error) {
      errors[section] = error.message
    }
  }

  return { successful: results, failed: errors }
}

/**
 * Determine test type based on student class
 * @param {string|number} studentClass - Student's class (e.g., '10', '12')
 * @returns {string} 'degreeExplorer' for class >= 10, 'streamSelector' for class < 10
 */
export function getTestTypeByClass(studentClass) {
  if (!studentClass) {
    return 'streamSelector' // Default to stream selector
  }

  const classNum = parseInt(studentClass, 10)
  if (classNum >= 10) {
    return 'degreeExplorer'
  }
  return 'streamSelector'
}

/**
 * Transform Firestore questions to UI format
 * Handles different question types and normalizes data
 */
export function transformQuestionsToUIFormat(section, firestoreData) {
  const questions = []
  let questionIndex = 0

  // Handle likertItems
  if (firestoreData.likertItems && Array.isArray(firestoreData.likertItems)) {
    firestoreData.likertItems.forEach((item) => {
      questions.push({
        id: item.id,
        type: 'likert',
        text: item.text,
        cluster: item.cluster || item.trait || item.factor,
        reversed: item.reversed || false,
      })
    })
  }

  // Handle forcedChoiceItems
  if (firestoreData.forcedChoiceItems && Array.isArray(firestoreData.forcedChoiceItems)) {
    firestoreData.forcedChoiceItems.forEach((item) => {
      questions.push({
        id: item.id,
        type: 'forced-choice',
        text: item.scenario || item.text || '',
        optionA: item.optionA,
        optionB: item.optionB,
        clusterA: item.clusterA || item.subjectA,
        clusterB: item.clusterB || item.subjectB,
      })
    })
  }

  // Handle scenarioItems
  if (firestoreData.scenarioItems && Array.isArray(firestoreData.scenarioItems)) {
    firestoreData.scenarioItems.forEach((item) => {
      const options = []
      if (item.optionA) {
        options.push({
          id: 'A',
          text: item.optionA,
          value: item.optionAValue || 3,
        })
      }
      if (item.optionB) {
        options.push({
          id: 'B',
          text: item.optionB,
          value: item.optionBValue || 2,
        })
      }
      if (item.optionC) {
        options.push({
          id: 'C',
          text: item.optionC,
          value: item.optionCValue || 1,
        })
      }

      questions.push({
        id: item.id,
        type: 'scenario',
        text: item.scenario,
        trait: item.trait,
        options: options,
      })
    })
  }

  // Handle scenarios (work values)
  if (firestoreData.scenarios && Array.isArray(firestoreData.scenarios)) {
    firestoreData.scenarios.forEach((item) => {
      questions.push({
        id: item.id,
        type: 'scenario-multiple',
        text: item.text,
        options: item.options || {},
      })
    })
  }

  // Handle subtests (aptitude)
  if (firestoreData.subtests && Array.isArray(firestoreData.subtests)) {
    firestoreData.subtests.forEach((subtest) => {
      if (subtest.items && Array.isArray(subtest.items)) {
        subtest.items.forEach((item) => {
          const options = []
          if (item.optionA)
            options.push({ id: 'A', text: item.optionA })
          if (item.optionB)
            options.push({ id: 'B', text: item.optionB })
          if (item.optionC)
            options.push({ id: 'C', text: item.optionC })
          if (item.optionD)
            options.push({ id: 'D', text: item.optionD })

          questions.push({
            id: item.id,
            type: 'aptitude',
            text: item.text,
            subtest: subtest.name,
            timeLimit: subtest.timeLimit,
            options: options,
          })
        })
      }
    })
  }

  return questions
}
