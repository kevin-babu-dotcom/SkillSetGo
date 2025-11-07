import { initFirebase } from './config'
import { getFirestore, doc, setDoc, collection, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore'

initFirebase()

const db = getFirestore()

export { db }

// Check if email exists in Firestore
export async function checkEmailExistsInFirestore(email) {
  if (!email) return false
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      console.log('Email found in Firestore:', email)
      return true
    }
    return false
  } catch (error) {
    console.error('Error checking email in Firestore:', error)
    return false
  }
}

// Check if phone number exists in any user profile
export async function checkPhoneExists(phoneNumber) {
  if (!phoneNumber) return false
  try {
    // Normalize phone number (remove spaces, keep + and digits)
    const normalizedPhone = phoneNumber.replace(/\s+/g, '').trim()
    
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('phone', '==', normalizedPhone))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      console.log('Phone number found in Firestore:', normalizedPhone)
      return true
    }
    
    // Also check with original format in case it's stored differently
    if (normalizedPhone !== phoneNumber) {
      const q2 = query(usersRef, where('phone', '==', phoneNumber))
      const snapshot2 = await getDocs(q2)
      if (!snapshot2.empty) {
        console.log('Phone number found in Firestore (alternate format):', phoneNumber)
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Error checking phone:', error)
    // In case of error, return false to allow the Firebase Auth check to catch it
    return false
  }
}

// Create initial user profile with notCompleted flag
export async function createInitialUserProfile(uid, data) {
  if (!uid) throw new Error('uid required')
  const ref = doc(db, 'users', uid)
  await setDoc(ref, {
    ...data,
    notCompleted: true,
    createdAt: new Date().toISOString()
  }, { merge: true })
  return ref
}

// Update user profile and mark as completed
export async function completeUserProfile(uid, data) {
  if (!uid) throw new Error('uid required')
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    ...data,
    notCompleted: false,
    completedAt: new Date().toISOString()
  })
  return ref
}

export async function createUserProfile(uid, data) {
  if (!uid) throw new Error('uid required')
  const ref = doc(db, 'users', uid)
  await setDoc(ref, data, { merge: true })
  return ref
}

// Get user profile and check notCompleted flag
export async function getUserProfile(uid) {
  if (!uid) throw new Error('uid required')
  const ref = doc(db, 'users', uid)
  const docSnap = await getDoc(ref)
  
  if (docSnap.exists()) {
    return docSnap.data()
  }
  return null
}
