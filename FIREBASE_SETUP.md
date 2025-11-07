# Firebase Phone Authentication Setup Guide

## Overview
This guide walks you through setting up Firebase Phone Authentication for the new signup flow in SkillSetGo.

## New Signup Flow (Updated)
1. **Step 1**: User fills complete form (name, email, phone, password, city, class, school)
   - System checks if email/phone already exist
   - If available, sends OTP via SMS
2. **Step 2**: User enters OTP code
   - Verifies phone and creates account
   - Links email/password authentication
   - Saves profile to Firestore
3. **Complete**: User has dual auth (phone + email/password)

**Key Change**: All data collected upfront, validation before OTP send, single streamlined flow.

---

## Firebase Console Setup

### 1. Enable Authentication Providers

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **skillsetgo-787**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider (click on it, toggle enable, save)
5. Enable **Phone** provider (click on it, toggle enable, save)

### 2. Add Authorized Domains

1. In **Authentication** → **Settings** → **Authorized domains**
2. Ensure these domains are listed:
   - `localhost` (for local development)
   - Your production domain (e.g., `skillsetgo.com`)

### 3. Set Up Test Phone Numbers (Recommended for Development)

To avoid SMS costs and rate limits during development:

1. Go to **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Click **Add phone number**
4. Add test numbers with verification codes:
   - Phone: `+919876543210` → Code: `123456`
   - Phone: `+911234567890` → Code: `654321`
5. Click **Add**

**Note**: Test phone numbers will NOT send real SMS. They instantly "verify" with the configured code.

---

## Environment Variables

Your `.env.local` file is already configured with these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAPTfLz2OBbE9mNZoUVfBWmQkBvOs5C9Q0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skillsetgo-787.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skillsetgo-787
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skillsetgo-787.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=913028948609
NEXT_PUBLIC_FIREBASE_APP_ID=1:913028948609:web:99f8bacebbcd636bb12380
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E5WK1Z2V4P
```

**Security Note**: These are **client-side** config values and safe to expose. Never put service account credentials in `.env.local`.

---

## How to Run Locally

### Start Development Server

```powershell
npm run dev
```

Navigate to: `http://localhost:3000/signup`

### Testing the Flow

#### Option A: Using Test Phone Numbers (No SMS)
1. Fill form with:
   - Full name: `Test User`
   - Email: `test@example.com`
   - Phone: `+919876543210` (test number from Firebase Console)
   - Password: `password123`
2. Click "Continue to verify phone"
3. Enter OTP: `123456` (the code you configured in Firebase Console)
4. Click "Verify OTP"
5. Fill profile: City, Class, School
6. Click "Finish"

#### Option B: Using Real Phone Number (Sends SMS)
1. Use your actual phone number with country code (e.g., `+919998887777`)
2. You'll receive a real SMS with a 6-digit code
3. Enter the code to verify

**Important**: Real SMS counts toward Firebase quotas and may incur charges depending on your plan.

---

## Firebase Authentication Limits

- **Phone Auth**: 10,000 verifications/day on free plan
- **SMS Rate Limit**: ~10 SMS per phone number per day (anti-abuse)
- For production, consider upgrading to Blaze plan

---

## Firestore Security Rules (Required)

Your user profiles are stored in Firestore at `users/{uid}`. Set up security rules:

1. Go to **Firestore Database** → **Rules**
2. Add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

## Troubleshooting

### Error: "RecaptchaVerifier is not defined"
- **Solution**: Ensure `localhost` is in Firebase **Authorized domains**

### Error: "auth/invalid-phone-number"
- **Solution**: Phone must include country code (e.g., `+919876543210`, not `9876543210`)

### Error: "auth/too-many-requests"
- **Solution**: You've hit rate limit. Wait 1 hour or use a different test phone number

### Error: "auth/code-expired"
- **Solution**: OTP codes expire after ~5 minutes. Request a new one

### Error: "auth/invalid-verification-code"
- **Solution**: Check you entered the correct 6-digit code

### ReCAPTCHA not appearing
- **Solution**: Using invisible reCAPTCHA - it auto-solves. Check browser console for errors

---

## Architecture Notes

### Why Email + Phone Linking?
- We create an **email/password account first** (Step 1)
- Then **link the phone number** to that account (Step 2)
- This gives users two ways to sign in and prevents orphaned phone-only accounts

### Client-Side vs Server-Side
- Currently, profile writes use **client-side Firestore** SDK
- For production, consider moving profile creation to a **Next.js API route** with Firebase Admin SDK for better security

---

## Next Steps

### Optional: Add Server-Side Profile Creation

For better security, create a server route to handle profile creation:

1. Generate a **Service Account** in Firebase Console:
   - Project Settings → Service Accounts → Generate new private key
2. Store the JSON securely (e.g., as env var `FIREBASE_SERVICE_ACCOUNT_JSON`)
3. Create API route at `src/app/api/users/create-profile/route.js`

Would you like me to add this server-side implementation?

---

## Additional Features to Consider

- **Resend OTP button** (with rate limiting)
- **Phone number formatting** (auto-add country code)
- **Email verification** (send verification email after signup)
- **Password strength indicator**
- **Social sign-in** (Google, Facebook) as alternatives

---

## Support

- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Stack Overflow - Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)
