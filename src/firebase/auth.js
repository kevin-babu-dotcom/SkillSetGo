import { 
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  createUserWithEmailAndPassword,
  updateProfile,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  signOut
} from 'firebase/auth';
import { auth } from './config'; // Import auth directly

// Setup reCAPTCHA verifier for phone authentication
export function setupRecaptcha(containerId) {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
}

// Send OTP to phone number
export async function sendPhoneOtp(phoneNumber, recaptchaVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

// Link email/password credentials to phone-authenticated user
export async function linkEmailPasswordToPhone(email, password, fullName) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    // Create email credential
    const credential = EmailAuthProvider.credential(email, password);
    
    // Link the email/password to the phone user
    const linkedResult = await linkWithCredential(currentUser, credential);
    
    // Update display name
    await updateProfile(linkedResult.user, {
      displayName: fullName
    });

    return linkedResult;
  } catch (error) {
    console.error('Error linking email/password:', error);
    throw error;
  }
}

// Check if email exists in Firebase Auth
export async function checkEmailExists(email) {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
}

// Login with email and password
export async function loginWithEmailPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error logging in with email/password:', error);
    throw error;
  }
}

// Login with phone OTP (returns confirmation result to verify later)
export async function loginWithPhoneOtp(phoneNumber, recaptchaVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error('Error sending login OTP:', error);
    throw error;
  }
}

// Sign out
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
