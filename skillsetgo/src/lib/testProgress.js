/**
 * Test Progress Persistence
 * Manages saving/loading test responses to localStorage
 * Structure: testProgress_{testType}_{section}
 */

const STORAGE_PREFIX = 'testProgress'

/**
 * Get storage key for a test
 */
export function getTestStorageKey(testType, section) {
  return `${STORAGE_PREFIX}_${testType}_${section}`
}

/**
 * Save test progress to localStorage
 * @param {string} testType - 'degreeExplorer' or 'streamSelector'
 * @param {string} section - test section name
 * @param {number} currentIndex - current question index
 * @param {object} responses - all responses so far
 * @param {number} startTime - when test started
 */
export function saveTestProgress(testType, section, currentIndex, responses, startTime) {
  try {
    const key = getTestStorageKey(testType, section)
    const progress = {
      testType,
      section,
      currentIndex,
      responses,
      startTime,
      lastSavedAt: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(progress))
    console.log('[testProgress] Saved:', { testType, section, currentIndex, responseCount: Object.keys(responses).length })
  } catch (error) {
    console.error('[testProgress] Error saving:', error.message)
  }
}

/**
 * Load test progress from localStorage
 * @returns {object|null} - progress object or null if not found
 */
export function loadTestProgress(testType, section) {
  try {
    const key = getTestStorageKey(testType, section)
    const stored = localStorage.getItem(key)
    
    if (!stored) {
      return null
    }

    const progress = JSON.parse(stored)
    console.log('[testProgress] Loaded:', { testType, section, currentIndex: progress.currentIndex, responseCount: Object.keys(progress.responses).length })
    return progress
  } catch (error) {
    console.error('[testProgress] Error loading:', error.message)
    return null
  }
}

/**
 * Clear test progress from localStorage
 */
export function clearTestProgress(testType, section) {
  try {
    const key = getTestStorageKey(testType, section)
    localStorage.removeItem(key)
    console.log('[testProgress] Cleared:', { testType, section })
  } catch (error) {
    console.error('[testProgress] Error clearing:', error.message)
  }
}

/**
 * Check if a test is in progress
 */
export function isTestInProgress(testType, section) {
  return loadTestProgress(testType, section) !== null
}

/**
 * Get all in-progress tests
 * @returns {array} - array of { testType, section, currentIndex, progress }
 */
export function getAllInProgressTests() {
  try {
    const allTests = []
    
    for (const [key, value] of Object.entries(localStorage)) {
      if (key.startsWith(STORAGE_PREFIX)) {
        const progress = JSON.parse(value)
        const { testType, section, currentIndex } = progress
        
        allTests.push({
          testType,
          section,
          currentIndex,
          // progress shown as percentage: currentIndex / totalQuestions
          // Note: totalQuestions will be available from the questions array
        })
      }
    }

    return allTests
  } catch (error) {
    console.error('[testProgress] Error getting all tests:', error.message)
    return []
  }
}
