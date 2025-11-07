# Authentication Flow Diagrams

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              ┌──────────┐        ┌──────────┐
              │  SIGNUP  │        │  LOGIN   │
              │  (NEW)   │        │(RETURN)  │
              └──────────┘        └──────────┘
                    │                   │
                    │                   │
                    ▼                   ▼
```

---

## 1. Signup Flow (New Users)

```
┌─────────────────────────────────────────────────────────────────┐
│                          SIGNUP FLOW                             │
└─────────────────────────────────────────────────────────────────┘

START → /signup

┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: BASIC INFORMATION                                       │
├──────────────────────────────────────────────────────────────────┤
│  User enters:                                                    │
│  • Full Name                                                     │
│  • Email                                                         │
│  • Phone Number (+country code)                                 │
│  • Password (min 6 chars)                                       │
├──────────────────────────────────────────────────────────────────┤
│  System checks:                                                  │
│  ✓ checkEmailExistsInFirestore(email)                          │
│  ✓ checkPhoneExists(phone)                                     │
│                                                                  │
│  If either exists → Error: "Already registered"                │
│  If both available → Continue                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    [Send OTP via SMS]
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: PHONE VERIFICATION                                      │
├──────────────────────────────────────────────────────────────────┤
│  User receives SMS with 6-digit OTP                             │
│  User enters: OTP Code                                          │
├──────────────────────────────────────────────────────────────────┤
│  System performs:                                                │
│  1. confirmationResult.confirm(otpCode)                         │
│     → Signs in user with phone number                           │
│                                                                  │
│  2. linkEmailPasswordToPhone(phoneUser, {email, password})      │
│     → Links email/password credentials                          │
│                                                                  │
│  3. createInitialUserProfile(uid, {fullName, email, phone})     │
│     → Saves to Firestore with notCompleted: true               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                [Profile saved: notCompleted = true]
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: PROFILE COMPLETION                                      │
├──────────────────────────────────────────────────────────────────┤
│  User enters:                                                    │
│  • City                                                          │
│  • Class                                                         │
│  • School                                                        │
├──────────────────────────────────────────────────────────────────┤
│  System performs:                                                │
│  completeUserProfile(uid, {city, class, school})                │
│  → Updates Firestore with notCompleted: false                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                [Profile complete: notCompleted = false]
                              │
                              ▼
                    ┌──────────────────┐
                    │  SUCCESS PAGE    │
                    │  "Signup Complete"│
                    └──────────────────┘
                              │
                              ▼
                    [Redirect to Dashboard]
```

---

## 2. Login Flow (Returning Users)

```
┌─────────────────────────────────────────────────────────────────┐
│                          LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────────┘

START → /login

                    ┌─────────────────┐
                    │  Choose Method  │
                    └─────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ EMAIL/PASSWORD   │        │   PHONE/OTP      │
    └──────────────────┘        └──────────────────┘
              │                           │
              │                           │
              ▼                           ▼
```

### Method A: Email & Password Login

```
┌──────────────────────────────────────────────────────────────────┐
│  EMAIL/PASSWORD LOGIN                                            │
├──────────────────────────────────────────────────────────────────┤
│  User enters:                                                    │
│  • Email address                                                 │
│  • Password                                                      │
├──────────────────────────────────────────────────────────────────┤
│  System performs:                                                │
│  loginWithEmailPassword(email, password)                        │
│  → Firebase authenticates credentials                           │
│                                                                  │
│  Possible errors:                                               │
│  • auth/user-not-found → "No account found"                    │
│  • auth/wrong-password → "Incorrect password"                  │
│  • auth/invalid-email → "Invalid email"                        │
└──────────────────────────────────────────────────────────────────┘
              │
              ▼
    [Authentication Successful]
              │
              ▼
    [Check Profile Status] ──────┐
              │                   │
              ▼                   ▼
    [See "Post-Login Flow" below]
```

### Method B: Phone & OTP Login

```
┌──────────────────────────────────────────────────────────────────┐
│  PHONE/OTP LOGIN - SEND OTP                                      │
├──────────────────────────────────────────────────────────────────┤
│  User enters:                                                    │
│  • Phone Number (+country code)                                 │
├──────────────────────────────────────────────────────────────────┤
│  System performs:                                                │
│  setupRecaptcha("login-recaptcha-container")                    │
│  loginWithPhoneOtp(phoneNumber, verifier)                       │
│  → Firebase sends SMS with OTP                                  │
│                                                                  │
│  Possible errors:                                               │
│  • auth/invalid-phone-number → "Invalid format"                │
│  • auth/too-many-requests → "Try again later"                  │
└──────────────────────────────────────────────────────────────────┘
              │
              ▼
    [User receives SMS]
              │
              ▼
┌──────────────────────────────────────────────────────────────────┐
│  PHONE/OTP LOGIN - VERIFY OTP                                    │
├──────────────────────────────────────────────────────────────────┤
│  User enters:                                                    │
│  • 6-digit OTP code                                             │
├──────────────────────────────────────────────────────────────────┤
│  System performs:                                                │
│  confirmationResult.confirm(otpCode)                            │
│  → Firebase verifies code and signs in user                     │
│                                                                  │
│  Possible errors:                                               │
│  • auth/invalid-verification-code → "Invalid OTP"              │
│  • auth/code-expired → "OTP expired"                           │
└──────────────────────────────────────────────────────────────────┘
              │
              ▼
    [Authentication Successful]
              │
              ▼
    [Check Profile Status] ──────┐
              │                   │
              ▼                   ▼
    [See "Post-Login Flow" below]
```

---

## 3. Post-Login Flow (Profile Check & Redirect)

```
┌─────────────────────────────────────────────────────────────────┐
│                     POST-LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────────┘

    [User Successfully Authenticated]
              │
              ▼
    ┌─────────────────────┐
    │ Get User Profile    │
    │ getUserProfile(uid) │
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Check notCompleted  │
    │       flag          │
    └─────────────────────┘
              │
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌────────────┐    ┌────────────┐
│ IF TRUE    │    │ IF FALSE   │
│ (incomplete)│    │ (complete) │
└────────────┘    └────────────┘
    │                   │
    │                   │
    ▼                   ▼
┌─────────────────────────────────────────┐
│  REDIRECT TO PROFILE COMPLETION         │
│  Route: /profile/complete               │
└─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  PROFILE COMPLETION PAGE                                         │
├─────────────────────────────────────────────────────────────────┤
│  System checks:                                                  │
│  • Is user authenticated? → If no, redirect to /login          │
│  • Does profile exist? → If no, redirect to /signup            │
│  • Is notCompleted true? → If no, redirect to /dashboard       │
├─────────────────────────────────────────────────────────────────┤
│  User enters:                                                    │
│  • City                                                          │
│  • Class                                                         │
│  • School                                                        │
├─────────────────────────────────────────────────────────────────┤
│  System performs:                                                │
│  completeUserProfile(uid, {city, class, school})                │
│  → Updates Firestore with notCompleted: false                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                  [Profile Complete]
                                │
                                │
┌───────────────────────────────┴───────────────────────────────┐
│                                                                 │
│                                                                 │
▼                                                                 ▼
┌─────────────────────────────────────────┐    ┌─────────────────────────┐
│  REDIRECT TO DASHBOARD                  │◄───│  DIRECT TO DASHBOARD    │
│  Route: /student/dashboard              │    │  (Profile was complete) │
│  (After completion)                     │    └─────────────────────────┘
└─────────────────────────────────────────┘

              ┌───────────────────────┐
              │     DASHBOARD         │
              │  (User's main page)   │
              └───────────────────────┘
```

---

## 4. Data Flow - Firestore Database

```
┌─────────────────────────────────────────────────────────────────┐
│                  FIRESTORE DATA LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

SIGNUP STEP 2 (OTP Verified):
┌─────────────────────────────────────────┐
│  users/{uid}                            │
├─────────────────────────────────────────┤
│  fullName: "John Doe"                   │
│  email: "john@example.com"              │
│  phone: "+919876543210"                 │
│  notCompleted: true         ← KEY FLAG  │
│  createdAt: "2025-11-06..."             │
└─────────────────────────────────────────┘
                │
                ▼
           [User logs in]
                │
                ▼
      [Redirect to /profile/complete]
                │
                ▼

SIGNUP STEP 3 / PROFILE COMPLETION:
┌─────────────────────────────────────────┐
│  users/{uid}                            │
├─────────────────────────────────────────┤
│  fullName: "John Doe"                   │
│  email: "john@example.com"              │
│  phone: "+919876543210"                 │
│  notCompleted: false        ← UPDATED   │
│  city: "Mumbai"             ← NEW       │
│  class: "10th Grade"        ← NEW       │
│  school: "Delhi Public..."  ← NEW       │
│  createdAt: "2025-11-06..."             │
│  completedAt: "2025-11-06..." ← NEW     │
└─────────────────────────────────────────┘
                │
                ▼
       [Future logins go directly
        to /student/dashboard]
```

---

## 5. Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT STRUCTURE                           │
└─────────────────────────────────────────────────────────────────┘

Pages (App Router):
├── (auth)/
│   ├── signup/page.js ──────────┐
│   │                            │
│   └── login/page.js ───────────┤
│                                │
└── profile/                     │
    └── complete/page.js ────────┤
                                 │
                                 ▼
Components:                 Uses Components:
├── auth/
│   ├── SignupStepper.jsx ◄─── signup/page.js
│   ├── LoginForm.jsx     ◄─── login/page.js
│   └── ProfileComplete   ◄─── profile/complete/page.js
│
└── All Components Use:
    ├── firebase/auth.js      (Authentication functions)
    └── firebase/firestore.js (Database functions)
```

---

## 6. Decision Tree - User Experience

```
                        [User Arrives]
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            [Has Account?]         [No Account]
                    │                   │
        ┌───────────┴──────────┐        │
        │                      │        ▼
        ▼                      ▼    [Go to /signup]
   [Email/Pass]         [Phone/OTP]      │
        │                      │         │
        └──────────┬───────────┘         │
                   │                     │
                   ▼                     ▼
            [Authenticate]        [3-Step Signup]
                   │                     │
                   ▼                     │
          [Check Profile]                │
                   │                     │
        ┌──────────┴──────────┐          │
        │                     │          │
        ▼                     ▼          │
[notCompleted=true]  [notCompleted=false]│
        │                     │          │
        ▼                     │          │
[/profile/complete]           │          │
        │                     │          │
        └──────────┬──────────┘          │
                   │                     │
                   ▼                     ▼
            [/student/dashboard] ◄───────┘
                   │
                   ▼
              [User's App]
```

---

## 7. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING                              │
└─────────────────────────────────────────────────────────────────┘

[User Action]
      │
      ▼
[Try Authentication/Operation]
      │
      ├─ Success ──→ [Continue Flow]
      │
      └─ Error
           │
           ▼
    [Catch Error]
           │
           ▼
    [Check Error Code]
           │
           ├─ auth/user-not-found ──→ "No account found"
           ├─ auth/wrong-password ──→ "Incorrect password"
           ├─ auth/invalid-phone... ─→ "Invalid phone format"
           ├─ auth/invalid-verif... ─→ "Invalid OTP"
           └─ Other ──────────────────→ [Generic error message]
           │
           ▼
    [Display to User]
           │
           ▼
    [User Can Retry]
```

---

## Summary

All flows converge to ensure:
1. ✅ Every new user completes full profile
2. ✅ Returning users with incomplete profiles finish setup
3. ✅ Complete profiles go directly to dashboard
4. ✅ Clear error messages guide users
5. ✅ Consistent experience across login methods

The `notCompleted` flag is the key that ties everything together!
