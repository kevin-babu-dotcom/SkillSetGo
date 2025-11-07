# New Signup Flow Documentation

## Overview
The signup flow has been completely reworked to follow this sequence:
1. Collect all user data upfront
2. Validate email and phone availability
3. Send OTP for phone verification
4. Verify OTP and create linked account (phone + email/password)
5. Save profile to Firestore

## Flow Diagram

```
Step 1: User Form (All Data)
├─ Full Name
├─ Email
├─ Phone (+country code)
├─ Password
├─ City
├─ Class
└─ School
     ↓
Check Email Exists? ──Yes──> Show Error: "Email already in use"
     ↓ No
Check Phone Exists? ──Yes──> Show Error: "Phone already in use"
     ↓ No
Setup reCAPTCHA (invisible)
     ↓
Send OTP via SMS
     ↓
Step 2: OTP Verification
├─ User enters 6-digit code
└─ Submit
     ↓
Verify OTP (signs in with phone)
     ↓
Link Email/Password credentials
     ↓
Update displayName
     ↓
Save profile to Firestore
     ↓
Success! Account created
```

## Step-by-Step Implementation

### Step 1: Data Collection & Validation

**User fills single form with ALL fields:**
- Full name
- Email address
- Phone number (with country code)
- Password
- City
- Class/Grade
- School name

**Before proceeding:**
1. Check if email exists using `fetchSignInMethodsForEmail()`
2. Check if phone exists by querying Firestore `users` collection
3. If either exists, show specific error and stop
4. If both available, proceed to OTP

### Step 2: Phone OTP Verification

**Send OTP:**
- Setup invisible reCAPTCHA
- Call `signInWithPhoneNumber(auth, phone, recaptchaVerifier)`
- SMS sent to user's phone

**Verify OTP:**
- User enters 6-digit code
- Call `confirmationResult.confirm(code)`
- This signs the user in with phone number

### Step 3: Link Email/Password

**After phone verification:**
- User is now signed in with phone
- Create EmailAuthProvider credential
- Link email/password to phone account using `linkWithCredential()`
- Update user's displayName
- User now has **dual authentication**: phone AND email/password

### Step 4: Save Profile

**Store profile in Firestore:**
- Document path: `users/{uid}`
- Fields: fullName, email, phone, city, class, school

## Code Changes

### `src/firebase/auth.js`

**New functions:**
```javascript
// Check if email exists
export async function checkEmailExists(email)

// Verify OTP and link email/password
export async function verifyOtpAndCreateAccount(confirmationResult, code, { email, password, fullName })
```

### `src/firebase/firestore.js`

**New functions:**
```javascript
// Check if phone exists in Firestore
export async function checkPhoneExists(phoneNumber)
```

### `src/components/auth/SignupStepper.jsx`

**Complete rewrite:**
- Single form on Step 1 with all fields
- Validation before OTP send
- Step 2 only for OTP entry
- Step 3 shows success (removed separate profile step)

## User Experience

### Before (Old Flow)
1. Enter name, email, phone, password → Next
2. Enter OTP → Next
3. Enter city, class, school → Submit

### After (New Flow)
1. Enter ALL data in one form → Validates → Sends OTP
2. Enter OTP → Creates account automatically → Done

**Benefits:**
- ✅ Fewer steps (2 instead of 3)
- ✅ Validation happens before SMS cost
- ✅ Better UX - all data collected upfront
- ✅ Prevents duplicate accounts early

## Firebase Auth Structure

After signup, the user has:

**Authentication Methods:**
- Phone number (primary - verified via OTP)
- Email/Password (linked - for login flexibility)

**Profile Data (Firestore):**
```json
{
  "users": {
    "{uid}": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "city": "Mumbai",
      "class": "10th Grade",
      "school": "Delhi Public School"
    }
  }
}
```

## Error Messages

| Error Scenario | Message |
|---------------|---------|
| Email exists | "The email is already in use. Please use a different email or login." |
| Phone exists | "The phone number is already in use. Please use a different phone number or login." |
| Invalid OTP | "OTP verification or account creation failed" |
| Network error | Shows Firebase error message |

## Testing

### Test Case 1: New User (Success Path)
1. Fill form with unique email and phone
2. Submit → OTP sent
3. Enter correct OTP
4. ✅ Account created with both phone and email auth

### Test Case 2: Duplicate Email
1. Use existing email address
2. Submit
3. ❌ Error shown immediately (no OTP sent)

### Test Case 3: Duplicate Phone
1. Use existing phone number
2. Submit
3. ❌ Error shown immediately (no OTP sent)

### Test Case 4: Wrong OTP
1. Fill form, submit
2. Enter wrong OTP
3. ❌ Error: "OTP verification failed"

## Security Considerations

### Validations
- Email format validation (HTML5 + Firebase)
- Phone format (requires country code)
- Password minimum 6 characters
- All fields required

### Firebase Security Rules Needed

**Firestore rules** (for phone checking):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read/write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow limited reads for signup validation
      allow read: if request.auth == null && request.query.limit <= 1;
    }
  }
}
```

**Firestore index** (for performance):
- Collection: `users`
- Field: `phone` (Ascending)

## Advantages of This Flow

### 1. **Early Validation**
- Email/phone checked BEFORE sending SMS
- Saves money on unnecessary OTP sends
- Better user experience

### 2. **Single Form UX**
- All data collected upfront
- User sees full picture before committing
- Fewer "Next" button clicks

### 3. **Dual Authentication**
- Users can login with email/password OR phone OTP
- Flexibility for future login flows
- Single account, multiple methods

### 4. **Data Integrity**
- Phone verified before account creation
- No orphaned records
- Profile saved atomically with account

## Migration Notes

If you have existing users:
- Old users have phone linked to email account
- New users have email linked to phone account
- Both work the same way for login
- No breaking changes for existing accounts

## Future Enhancements

- [ ] Add "Back" button on OTP step
- [ ] Resend OTP with countdown timer
- [ ] Real-time email/phone availability check
- [ ] Visual indicators (✓/✗) for availability
- [ ] Phone number formatting helper
- [ ] Country code dropdown selector
- [ ] Password strength indicator
- [ ] Social login options (Google, Facebook)
