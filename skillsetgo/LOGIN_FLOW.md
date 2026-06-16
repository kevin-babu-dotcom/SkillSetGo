# Login Flow Documentation

## Overview
The login system supports two authentication methods:
1. **Email & Password** - Traditional email/password login
2. **Phone & OTP** - Phone number verification with OTP

After successful login, the system checks the user's profile completion status and redirects accordingly.

## Login Methods

### Method 1: Email & Password Login

**Flow:**
1. User enters email and password
2. Firebase authenticates credentials
3. System checks user profile in Firestore
4. Redirects based on `notCompleted` flag

**Files Involved:**
- `src/components/auth/LoginForm.jsx` - Login form component
- `src/firebase/auth.js` - `loginWithEmailPassword()` function
- `src/firebase/firestore.js` - `getUserProfile()` function

**Code Example:**
```javascript
const userCredential = await loginWithEmailPassword(email, password);
const profile = await getUserProfile(userCredential.user.uid);

if (profile.notCompleted === true) {
  router.push("/profile/complete"); // Step 3 of signup
} else {
  router.push("/student/dashboard"); // Main dashboard
}
```

### Method 2: Phone & OTP Login

**Flow:**
1. User enters phone number (with country code, e.g., +919876543210)
2. Firebase sends OTP via SMS
3. User enters 6-digit OTP
4. Firebase verifies OTP and authenticates user
5. System checks user profile in Firestore
6. Redirects based on `notCompleted` flag

**Files Involved:**
- `src/components/auth/LoginForm.jsx` - Login form component
- `src/firebase/auth.js` - `loginWithPhoneOtp()`, `setupRecaptcha()` functions
- `src/firebase/firestore.js` - `getUserProfile()` function

**Code Example:**
```javascript
// Step 1: Send OTP
const verifier = setupRecaptcha("login-recaptcha-container");
const confirmResult = await loginWithPhoneOtp(phone, verifier);

// Step 2: Verify OTP
const result = await confirmResult.confirm(otpCode);

// Step 3: Check profile
const profile = await getUserProfile(result.user.uid);

if (profile.notCompleted === true) {
  router.push("/profile/complete");
} else {
  router.push("/student/dashboard");
}
```

## Profile Completion Check

### The `notCompleted` Flag

The user profile in Firestore contains a `notCompleted` boolean flag:
- **`true`**: User completed steps 1-2 of signup but not step 3 (city, class, school)
- **`false`**: User completed all signup steps

### Redirect Logic

After successful login, the system checks the flag and redirects:

| Flag Value | Profile Status | Redirect To |
|------------|----------------|-------------|
| `true` | Incomplete | `/profile/complete` (Step 3) |
| `false` | Complete | `/student/dashboard` |
| Missing | No profile | `/signup` |

### Implementation

**In LoginForm.jsx:**
```javascript
async function handlePostLogin(user) {
  try {
    const profile = await getUserProfile(user.uid);
    
    if (profile && profile.notCompleted === true) {
      router.push("/profile/complete");
    } else {
      router.push("/student/dashboard");
    }
  } catch (err) {
    console.error("Error checking profile:", err);
    router.push("/student/dashboard");
  }
}
```

## Profile Completion Page

**Route:** `/profile/complete`  
**Component:** `src/components/auth/ProfileComplete.jsx`

This page is equivalent to **Step 3 of the signup flow**. It:

1. Checks if user is authenticated
2. Verifies profile exists and `notCompleted === true`
3. Collects remaining information (city, class, school)
4. Calls `completeUserProfile()` to update Firestore
5. Sets `notCompleted = false`
6. Redirects to dashboard

**Form Fields:**
- City (e.g., Mumbai)
- Class (e.g., 10th Grade)
- School (e.g., Delhi Public School)

## Firebase Authentication Functions

### Login Functions (src/firebase/auth.js)

```javascript
// Email/Password Login
export async function loginWithEmailPassword(email, password)

// Phone OTP Login - Send OTP
export async function loginWithPhoneOtp(phoneNumber, recaptchaVerifier)

// Setup reCAPTCHA for phone auth
export function setupRecaptcha(containerId)
```

### Firestore Functions (src/firebase/firestore.js)

```javascript
// Get user profile with notCompleted flag
export async function getUserProfile(uid)

// Complete user profile and set notCompleted = false
export async function completeUserProfile(uid, data)
```

## Error Handling

### Email/Password Login Errors

| Error Code | User Message |
|------------|--------------|
| `auth/user-not-found` | "No account found with this email." |
| `auth/wrong-password` | "Incorrect password." |
| `auth/invalid-email` | "Invalid email address." |
| `auth/user-disabled` | "This account has been disabled." |
| `auth/invalid-credential` | "Invalid email or password." |

### Phone OTP Login Errors

| Error Code | User Message |
|------------|--------------|
| `auth/invalid-phone-number` | "Invalid phone number format. Please include country code (e.g., +91)." |
| `auth/too-many-requests` | "Too many attempts. Please try again later." |
| `auth/invalid-verification-code` | "Invalid OTP code. Please check and try again." |
| `auth/code-expired` | "OTP code has expired. Please request a new one." |

## UI/UX Features

### Login Form Features
- **Tabbed Interface**: Switch between Email/Password and Phone/OTP methods
- **Loading States**: Disabled buttons with loading text during authentication
- **Error Display**: Red alert boxes for user-friendly error messages
- **Responsive Design**: Tailwind CSS styling, mobile-friendly
- **Input Validation**: Required fields, pattern matching for OTP

### Profile Completion Features
- **Loading State**: Spinner while checking profile status
- **Auto-Redirect**: Redirects if profile already complete
- **Authentication Guard**: Redirects to login if not authenticated
- **Progress Indicator**: Clear messaging that this is profile completion

## Testing the Flow

### Test Scenario 1: New User (Email/Password)
1. Go to `/signup`
2. Complete steps 1-2 (basic info, OTP verification)
3. Navigate away before completing step 3
4. Go to `/login`
5. Login with email/password
6. ✅ Should redirect to `/profile/complete`
7. Complete profile
8. ✅ Should redirect to `/student/dashboard`

### Test Scenario 2: Returning User (Phone OTP)
1. Complete full signup flow (all 3 steps)
2. Logout
3. Go to `/login`
4. Choose "Phone & OTP" method
5. Enter phone number and verify OTP
6. ✅ Should redirect directly to `/student/dashboard`

### Test Scenario 3: Incomplete Profile Direct Access
1. Incomplete profile user tries to access `/student/dashboard`
2. Should be redirected to `/profile/complete` (requires middleware/protection)

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.js              # Login page wrapper
│   └── profile/
│       └── complete/
│           └── page.js              # Profile completion page wrapper
├── components/
│   └── auth/
│       ├── LoginForm.jsx            # Main login component (NEW)
│       ├── ProfileComplete.jsx      # Profile completion component (NEW)
│       └── SignupStepper.jsx        # Signup component
└── firebase/
    ├── auth.js                      # Auth helper functions (UPDATED)
    └── firestore.js                 # Firestore helper functions (UPDATED)
```

## Environment Requirements

Ensure `.env.local` contains:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firebase Console Setup

### Authentication Providers
1. **Email/Password**: Enabled
2. **Phone**: Enabled with test phone numbers for development

### Firestore Database Structure
```
users (collection)
  └── {uid} (document)
      ├── fullName: string
      ├── email: string
      ├── phone: string
      ├── notCompleted: boolean
      ├── city: string (optional until step 3)
      ├── class: string (optional until step 3)
      ├── school: string (optional until step 3)
      ├── createdAt: timestamp
      └── completedAt: timestamp (added when notCompleted = false)
```

## Next Steps

### Recommended Enhancements
1. **Route Protection**: Add middleware to protect routes based on profile completion
2. **Remember Me**: Add persistent login option
3. **Forgot Password**: Implement password reset flow
4. **Social Auth**: Add Google/Facebook login options
5. **Profile Management**: Allow users to edit profile after completion
6. **Session Management**: Add logout functionality on all pages
7. **Loading States**: Add skeleton loaders for better UX

### Security Considerations
1. **Rate Limiting**: Implement on backend to prevent abuse
2. **Phone Verification**: Use Firebase test numbers in development
3. **Error Messages**: Don't reveal if email exists (security best practice)
4. **Session Timeout**: Implement automatic logout after inactivity
5. **HTTPS Only**: Ensure production runs on HTTPS
