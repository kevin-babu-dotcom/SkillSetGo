# Complete Authentication System - Quick Reference

## 🔐 Authentication Flows

### Signup Flow (3 Steps)
```
Step 1: Basic Info → Step 2: Phone OTP → Step 3: Profile Details
├─ Check Firestore for duplicates
├─ Verify phone with OTP
├─ Link email/password credentials
├─ Save with notCompleted=true
└─ Complete profile, set notCompleted=false
```

**Route:** `/signup`  
**Component:** `src/components/auth/SignupStepper.jsx`  
**Documentation:** `NEW_SIGNUP_FLOW.md`

---

### Login Flow (2 Methods)
```
Email/Password OR Phone/OTP
├─ Authenticate with Firebase
├─ Check user profile in Firestore
└─ Redirect based on notCompleted flag
    ├─ true → /profile/complete (Step 3)
    └─ false → /student/dashboard
```

**Route:** `/login`  
**Component:** `src/components/auth/LoginForm.jsx`  
**Documentation:** `LOGIN_FLOW.md`

---

### Profile Completion (Step 3 Standalone)
```
If notCompleted=true after login
├─ Collect: city, class, school
├─ Update Firestore profile
├─ Set notCompleted=false
└─ Redirect to dashboard
```

**Route:** `/profile/complete`  
**Component:** `src/components/auth/ProfileComplete.jsx`

---

## 📁 File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── signup/page.js          ✓ Signup page
│   │   └── login/page.js           ✓ Login page
│   └── profile/
│       └── complete/page.js        ✓ Profile completion
│
├── components/
│   └── auth/
│       ├── SignupStepper.jsx       ✓ 3-step signup
│       ├── LoginForm.jsx           ✓ Login with 2 methods
│       └── ProfileComplete.jsx     ✓ Complete profile
│
└── firebase/
    ├── config.js                   ✓ Firebase initialization
    ├── auth.js                     ✓ Auth functions
    └── firestore.js                ✓ Database functions
```

---

## 🔧 Firebase Functions Reference

### Authentication (auth.js)

#### Signup Functions
```javascript
setupRecaptcha(containerId)          // Setup invisible reCAPTCHA
sendPhoneOtp(phone, verifier)        // Send OTP to phone
linkEmailPasswordToPhone(user, data) // Link email to phone account
```

#### Login Functions
```javascript
loginWithEmailPassword(email, pass)  // Email/password login
loginWithPhoneOtp(phone, verifier)   // Phone OTP login (send)
// confirmResult.confirm(code)       // Phone OTP verify
```

#### Utility Functions
```javascript
checkEmailExists(email)              // Check email in Auth
signOut()                            // Logout user
onAuthChanged(callback)              // Auth state listener
```

### Firestore (firestore.js)

#### Profile Management
```javascript
// Check duplicates (Firestore)
checkEmailExistsInFirestore(email)   
checkPhoneExists(phone)              

// Create/Update profiles
createInitialUserProfile(uid, data)  // notCompleted=true
completeUserProfile(uid, data)       // notCompleted=false
getUserProfile(uid)                  // Get profile data
```

---

## 🗄️ Database Schema

### Firestore Collection: `users`

```javascript
{
  uid: string,                  // Firebase Auth UID
  
  // Step 1-2 fields (saved with notCompleted=true)
  fullName: string,
  email: string,
  phone: string,
  notCompleted: boolean,        // KEY FLAG
  createdAt: timestamp,
  
  // Step 3 fields (saved when notCompleted=false)
  city: string,
  class: string,
  school: string,
  completedAt: timestamp
}
```

---

## 🎯 Key Concepts

### The `notCompleted` Flag
- **Purpose**: Track profile completion status
- **Set to `true`**: After Step 2 (phone OTP verified, email linked)
- **Set to `false`**: After Step 3 (city, class, school added)
- **Used by**: Login flow to determine redirect destination

### Redirect Logic
```javascript
const profile = await getUserProfile(user.uid);

if (profile.notCompleted === true) {
  router.push("/profile/complete");  // Finish signup
} else {
  router.push("/student/dashboard");  // Go to app
}
```

---

## 🚀 Quick Start Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Access pages
# Signup: http://localhost:3000/signup
# Login: http://localhost:3000/login
# Profile: http://localhost:3000/profile/complete
```

---

## ✅ Testing Checklist

### Signup Flow
- [ ] Step 1: Duplicate email detection works
- [ ] Step 1: Duplicate phone detection works
- [ ] Step 2: OTP sent successfully
- [ ] Step 2: OTP verification works
- [ ] Step 2: Email/password linked to phone
- [ ] Step 2: Profile saved with notCompleted=true
- [ ] Step 3: Profile completed with notCompleted=false
- [ ] Step 4: Success message shown

### Login Flow - Email/Password
- [ ] Valid credentials login successfully
- [ ] Invalid credentials show error
- [ ] Incomplete profile redirects to /profile/complete
- [ ] Complete profile redirects to /student/dashboard

### Login Flow - Phone/OTP
- [ ] OTP sent to valid phone number
- [ ] Invalid phone shows error
- [ ] Valid OTP logs in successfully
- [ ] Invalid OTP shows error
- [ ] Incomplete profile redirects to /profile/complete
- [ ] Complete profile redirects to /student/dashboard

### Profile Completion
- [ ] Page loads for incomplete profiles
- [ ] Complete profiles redirect to dashboard
- [ ] Unauthenticated users redirect to login
- [ ] Profile completion saves data correctly
- [ ] notCompleted flag set to false
- [ ] Redirects to dashboard after completion

---

## 🐛 Common Issues & Solutions

### Issue: reCAPTCHA not working
**Solution:** Check Firebase console > Authentication > Sign-in method > Phone > Add your domain to authorized domains

### Issue: "auth/invalid-phone-number"
**Solution:** Ensure phone includes country code (e.g., +919876543210)

### Issue: "auth/email-already-in-use" during login
**Solution:** This is expected if user exists - they should use login instead of signup

### Issue: Redirect loop after login
**Solution:** Check if notCompleted flag is properly set in Firestore

### Issue: getUserProfile returns null
**Solution:** Ensure profile was created during signup step 2

---

## 📚 Documentation Files

1. **FIREBASE_SETUP.md** - Initial Firebase setup guide
2. **NEW_SIGNUP_FLOW.md** - Detailed signup flow documentation
3. **LOGIN_FLOW.md** - Detailed login flow documentation
4. **AUTH_REFERENCE.md** - This file (quick reference)

---

## 🔐 Security Reminders

1. ✅ Never commit `.env.local` to version control
2. ✅ Use Firebase test phone numbers in development
3. ✅ Enable reCAPTCHA Enterprise in production
4. ✅ Set up Firestore security rules
5. ✅ Implement rate limiting for auth endpoints
6. ✅ Use HTTPS in production
7. ✅ Add CORS configuration for API routes

---

## 📞 Support & Resources

- **Firebase Auth Docs**: https://firebase.google.com/docs/auth
- **Firebase Phone Auth**: https://firebase.google.com/docs/auth/web/phone-auth
- **Next.js Routing**: https://nextjs.org/docs/app/building-your-application/routing

---

*Last Updated: Implementation complete with signup, login (2 methods), and profile completion flows.*
