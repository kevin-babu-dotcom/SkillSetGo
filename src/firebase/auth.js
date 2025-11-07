/* Client-side Firebase auth helpers (modular SDK) */
import { initFirebase } from './config'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  PhoneAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail
} from 'firebase/auth'

initFirebase()

const auth = getAuth()

export { auth }

// Check if email exists in Firebase Auth
export async function checkEmailExists(email) {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods.length > 0
  } catch (error) {
    console.error('Error checking email:', error)
    return false
  }
}

// Check if phone exists by attempting to get user info (requires server-side check for production)
// For now, we'll rely on Firestore check in the component
export async function checkPhoneExistsInAuth(phoneNumber) {
  // Firebase Auth doesn't have a direct client-side method to check phone
  // This will be done via Firestore in the signup flow
  return false
}

export async function signUpWithEmail({ email, password, fullName }) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password)
  if (fullName && userCred.user) {
    try {
      await updateProfile(userCred.user, { displayName: fullName })
    } catch (e) {
      // non-fatal
      console.error('updateProfile failed', e)
    }
  }
  return userCred
}

export function setupRecaptcha(containerId = 'recaptcha-container') {
  // RecaptchaVerifier must run in browser
  if (typeof window === 'undefined') return null
  try {
    // Modular SDK: auth is first parameter
    const verifier = new RecaptchaVerifier(auth, containerId, { 
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      }
    })
    return verifier
  } catch (e) {
    console.error('Recaptcha setup error', e)
    return null
  }
}

export async function sendPhoneOtp(phoneNumber, recaptchaVerifier) {
  if (!recaptchaVerifier) throw new Error('recaptchaVerifier required')
  // returns confirmationResult
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
  return confirmationResult
}

export async function verifyOtpAndLink(confirmationResult, code) {
  // confirmationResult.confirm(code) verifies the OTP
  // For linking phone to existing email user, we get the credential first
  if (!confirmationResult) throw new Error('confirmationResult required')
  
  // Get verificationId from confirmationResult
  const verificationId = confirmationResult.verificationId
  const credential = PhoneAuthProvider.credential(verificationId, code)
  
  // Link phone credential to current email user
  if (!auth.currentUser) throw new Error('No authenticated user to link phone to')
  const result = await linkWithCredential(auth.currentUser, credential)
  return result
}

// New function: After phone OTP verification, create and link email/password
export async function linkEmailPasswordToPhone(phoneUser, { email, password, fullName }) {
  if (!phoneUser) throw new Error('Phone user required')
  
  // Step 1: Create email/password credential
  const emailCredential = EmailAuthProvider.credential(email, password)
  
  // Step 2: Link email credential to phone user
  const linkedResult = await linkWithCredential(phoneUser, emailCredential)
  
  // Step 3: Update profile with full name
  if (fullName) {
    try {
      await updateProfile(linkedResult.user, { displayName: fullName })
    } catch (e) {
      console.error('updateProfile failed', e)
    }
  }
  
  return linkedResult
}

export async function signOut() {
  return firebaseSignOut(auth)
}

export function onAuthChanged(cb) {
  return onAuthStateChanged(auth, cb)
}

// Login with email and password
export async function loginWithEmailPassword(email, password) {
  if (!email || !password) throw new Error('Email and password are required')
  
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential
}

// Login with phone OTP - send OTP
export async function loginWithPhoneOtp(phoneNumber, recaptchaVerifier) {
  if (!phoneNumber) throw new Error('Phone number is required')
  if (!recaptchaVerifier) throw new Error('RecaptchaVerifier is required')
  
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
  return confirmationResult
}
