/**
 * Client-side utility for submitting test responses
 * Handles communication with backend scoring API
 */

/**
 * Submit test responses to the server for scoring and storage
 * @param {string} testType - 'degreeExplorer' or 'streamSelector'
 * @param {string} section - section name (interests, personality, etc)
 * @param {string} moduleId - module ID (career-interests, personality, etc)
 * @param {Object} responses - { questionId: answer, ... }
 * @param {number} timeSpent - time spent in milliseconds
 * @param {string} authToken - Firebase auth token
 * @returns {Promise<Object>} Scored result with scores
 */
export async function submitTestResponses(testType, section, moduleId, responses, timeSpent, authToken) {
  if (!authToken) {
    throw new Error('Authentication token required')
  }

  if (!testType || !section || !responses) {
    throw new Error('Missing required parameters: testType, section, responses')
  }

  try {
    console.log('[submitTest] Submitting test responses...', {
      testType,
      section,
      numResponses: Object.keys(responses).length,
      timeSpent,
    })

    const response = await fetch('/api/tests/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testType,
        section,
        moduleId,
        responses,
        timeSpent,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to submit test (${response.status})`)
    }

    const result = await response.json()
    console.log('[submitTest] ✓ Test submitted successfully:', {
      testType,
      section,
      scores: result.result.scores,
    })

    return result.result
  } catch (error) {
    console.error('[submitTest] Error submitting test:', error.message)
    throw error
  }
}
