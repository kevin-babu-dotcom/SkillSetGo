import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function getFirebaseAdminApp() {
  const existing = getApps()
  if (existing.length > 0) {
    return existing[0]
  }

  // Uses same env vars as your client Firebase config
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error(
      'Missing Firebase Admin SDK env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    )
  }

  return initializeApp({
    credential: cert(serviceAccount),
  })
}

const app = getFirebaseAdminApp()

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)