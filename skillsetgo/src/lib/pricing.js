// Pricing configuration - single source of truth for all prices
// Amounts in paise (₹1 = 100 paise)
// Backend ALWAYS recalculates prices - frontend amounts are ignored

// Class-based pricing for Tier 2 (degree_explorer)
// Classes 10 and below: ₹499
// Classes 11 and above: ₹699
export const CLASS_PRICING_CUTOFF = 10 // Class threshold

export const PLAN_PRICING = Object.freeze({
  stream_fit: 0, // ₹0 - Free tier
  degree_explorer_junior: 49900, // ₹499 - For class 10 and below
  degree_explorer_senior: 69900, // ₹699 - For class 11 and above
  degree_explorer: 69900, // Default to senior pricing if class not specified
  college_admission: 49900, // ₹499 base + (sessions × ₹1000)
})

// Tier 3 pricing constants
export const TIER3_BASE_PRICE = 49900 // ₹499 in paise
export const SESSION_PRICE = 100000 // ₹1000 per session in paise

/**
 * Determines if a student is junior (class 10 or below)
 * @param {number} classNumber - Student's class/grade number
 * @returns {boolean} - True if class <= 10
 */
export function isJuniorClass(classNumber) {
  if (!classNumber || typeof classNumber !== 'number') return false
  return classNumber <= CLASS_PRICING_CUTOFF
}

/**
 * Gets the degree_explorer pricing based on student class
 * @param {number} classNumber - Student's class/grade (1-12)
 * @returns {number} - Price in paise (₹499 for classes ≤10, ₹699 for classes >10)
 */
export function getDegreeExplorerPrice(classNumber) {
  // If class info is missing or invalid, default to senior pricing (₹699)
  if (!classNumber || typeof classNumber !== 'number') {
    return PLAN_PRICING.degree_explorer_senior
  }
  
  return isJuniorClass(classNumber) 
    ? PLAN_PRICING.degree_explorer_junior 
    : PLAN_PRICING.degree_explorer_senior
}

/**
 * Calculates price for college_admission tier based on number of sessions
 * @param {number} sessions - Number of counselling sessions (default: 1, min: 1)
 * @returns {number} - Price in paise
 */
export function calculateCollegeAdmissionPrice(sessions = 1) {
  const validSessions = Math.max(1, Math.floor(sessions || 1))
  return TIER3_BASE_PRICE + (validSessions * SESSION_PRICE)
}

/**
 * Validates and normalizes tier from untrusted input
 * @param {string} input - Raw tier input (usually from frontend)
 * @returns {string|null} - Valid tier key or null if invalid
 */
export function normalizeTier(input) {
  if (!input || typeof input !== 'string') return null
  const tier = input.trim().toLowerCase()
  
  // Normalize degree_explorer variants to base degree_explorer
  if (tier === 'degree_explorer_junior' || tier === 'degree_explorer_senior') {
    return 'degree_explorer'
  }
  
  return Object.prototype.hasOwnProperty.call(PLAN_PRICING, tier) ? tier : null
}

/**
 * Gets price in paise for a tier
 * Considers class information for degree_explorer pricing
 * @param {string} tier - Validated tier key
 * @param {number} classNumber - Student's class (for degree_explorer only)
 * @param {number} sessions - Sessions count (only used for college_admission)
 * @returns {number} - Price in paise
 */
export function getPriceForTier(tier, classNumber = null, sessions = null) {
  if (tier === 'college_admission') {
    return calculateCollegeAdmissionPrice(sessions)
  }
  
  if (tier === 'degree_explorer') {
    return getDegreeExplorerPrice(classNumber)
  }
  
  return PLAN_PRICING[tier] || 0
}
