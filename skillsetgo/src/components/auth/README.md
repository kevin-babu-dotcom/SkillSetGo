# Authentication Components

## SignupStepper Component

A multi-step signup flow that creates a user with email/password, verifies their phone number via SMS OTP, and collects profile information.

### Features

- ✅ Step 1: Email/Password signup with full name
- ✅ Step 2: Phone verification via SMS OTP (Firebase Auth)
- ✅ Step 3: Profile completion (city, class, school)
- ✅ Invisible reCAPTCHA for abuse prevention
- ✅ Phone number linking to email account
- ✅ Error handling and loading states

### Usage

```jsx
import SignupStepper from '@/components/auth/SignupStepper'

export default function SignupPage() {
  return <SignupStepper />
}
```

### Implementation Details

#### Step 1: Email/Password Creation
```javascript
await signUpWithEmail({ email, password, fullName })
```
- Creates Firebase user with email/password
- Sets displayName to full name
- User is automatically signed in

#### Step 2: Phone Verification
```javascript
const verifier = setupRecaptcha('recaptcha-container')
const confirmationResult = await sendPhoneOtp(phone, verifier)
// SMS sent, user enters code
await verifyOtpAndLink(confirmationResult, otpCode)
```
- Sets up invisible reCAPTCHA
- Sends SMS with 6-digit code
- Links phone credential to existing email user

#### Step 3: Profile Completion
```javascript
await createUserProfile(user.uid, {
  fullName,
  email,
  phone,
  city,
  class: schoolClass,
  school
})
```
- Saves profile to Firestore `users/{uid}` collection

### Props

None - component manages its own state

### State Management

- `step`: Current step (1-4)
- `loading`: Loading state for async operations
- `error`: Error message string
- `fullName`, `email`, `phone`, `password`: Step 1 form fields
- `confirmationResult`: Firebase confirmation result object
- `otpCode`: OTP entered by user
- `city`, `schoolClass`, `school`: Step 3 form fields

### Firebase Setup Required

See [FIREBASE_SETUP.md](../../../FIREBASE_SETUP.md) for complete setup instructions.

### Error Handling

Common errors:
- `auth/invalid-phone-number`: Phone must include country code
- `auth/invalid-verification-code`: Wrong OTP entered
- `auth/code-expired`: OTP expired (5 min limit)
- `auth/too-many-requests`: Rate limit hit
- `recaptchaVerifier required`: ReCAPTCHA setup failed

### Testing

Use Firebase test phone numbers to avoid SMS costs:
```
Phone: +919876543210
Code: 123456
```

Configure test numbers in Firebase Console → Authentication → Phone numbers for testing

### Improvements Roadmap

- [ ] Add resend OTP button with countdown timer
- [ ] Auto-format phone number with country code selector
- [ ] Add password strength indicator
- [ ] Add terms of service checkbox
- [ ] Show step progress indicator
- [ ] Add "Back" button to go to previous step
- [ ] Validate phone number format before sending OTP
- [ ] Add loading skeleton for better UX
