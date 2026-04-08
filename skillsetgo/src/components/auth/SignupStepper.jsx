"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  setupRecaptcha,
  sendPhoneOtp,
  linkEmailPasswordToPhone,
} from "@/firebase/auth";
import { auth } from "@/firebase/config";
import { 
  checkEmailExistsInFirestore, 
  checkPhoneExists,
  createInitialUserProfile,
  completeUserProfile
} from "@/firebase/firestore";

export default function SignupStepper({ profile }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const completeProfile = searchParams.get('completeProfile');
  
  // If user is logged in and completeProfile=true, start at step 3
  const [step, setStep] = useState(() => {
    if (completeProfile === 'true' && auth.currentUser) {
      return 3;
    }
    return profile ? 3 : 1;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basic form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: OTP verification
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);

  // Step 3: Profile fields
  const [city, setCity] = useState("");
  const [schoolClass, setSchoolClass] = useState("");
  const [school, setSchool] = useState("");

  const recaptchaContainerId = "recaptcha-container";
  const recaptchaVerifierRef = useRef(null);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    // If completeProfile=true but no authenticated user, redirect to login
    if (completeProfile === 'true' && !auth.currentUser) {
      router.push('/login');
    }
    
    // cleanup on unmount
    return () => {
      recaptchaVerifierRef.current = null;
    };
  }, [completeProfile, router]);

  // Normalize phone number to only digits (10 digits)
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    // Take only first 10 digits
    const normalized = digitsOnly.slice(0, 10);
    setPhone(normalized);
  };

  // Get full phone number in E.164 format
  const getE164Phone = () => {
    return `+91${phone}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Check Firestore for email/phone, then send OTP
  async function handleStep1(e) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Validate phone number
      if (phone.length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      const e164Phone = getE164Phone(); // Format: +91XXXXXXXXXX

      // Check if email exists in Firestore
      const emailExists = await checkEmailExistsInFirestore(email);
      if (emailExists) {
        throw new Error("The email is already registered. Please login instead.");
      }

      // Check if phone exists in Firestore
      const phoneExists = await checkPhoneExists(e164Phone);
      if (phoneExists) {
        throw new Error("The phone number is already registered. Please login instead.");
      }

      // Both email and phone are available - proceed with phone OTP
      // Only setup reCAPTCHA if we haven't already done so
      let verifier;
      if (recaptchaVerifierRef.current) {
        // Already verified, reuse existing verifier
        verifier = recaptchaVerifierRef.current;
      } else {
        // First time, setup new reCAPTCHA
        verifier = setupRecaptcha(recaptchaContainerId);
        recaptchaVerifierRef.current = verifier;
      }
      
      const confirmResult = await sendPhoneOtp(e164Phone, verifier);
      setConfirmationResult(confirmResult);
      setStep(2);
    } catch (err) {
      console.error(err);
      
      // Don't clear reCAPTCHA - we'll reuse it on retry
      // This avoids the "already rendered" error
      
      // Handle specific Firebase Auth errors
      let errorMessage = err?.message || "Failed to verify availability or send OTP";
      
      if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (err.code === 'auth/invalid-phone-number') {
        errorMessage = "Invalid phone number format. Please include country code (e.g., +91).";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP, link email/password, save initial profile with notCompleted=true
  async function handleVerifyOtp(e) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error("Missing confirmation result");

      const otpString = otpCode.join('');
      if (otpString.length !== 6) {
        throw new Error("Please enter all 6 digits");
      }

      // Step 1: Verify OTP - this signs user in with phone
      const phoneResult = await confirmationResult.confirm(otpString);
      const phoneUser = phoneResult.user;

      // Step 2: Link email/password to phone account
      const linkedResult = await linkEmailPasswordToPhone(email, password, fullName);

      // Step 3: Save initial profile to Firestore with notCompleted=true
      const e164Phone = getE164Phone();
      await createInitialUserProfile(linkedResult.user.uid, {
        fullName,
        email,
        phone: e164Phone
      });

      // Move to profile completion step
      setStep(3);
    } catch (err) {
      console.error(err);
      
      // Handle specific Firebase Auth errors
      let errorMessage = err?.message || "OTP verification or account creation failed";
      
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage = "Invalid OTP code. Please check and try again.";
      } else if (err.code === 'auth/code-expired') {
        errorMessage = "OTP code has expired. Please request a new one.";
      } else if (err.code === 'auth/credential-already-in-use') {
        errorMessage = "This phone number is already linked to another account.";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use.";
      } else if (err.code === 'auth/provider-already-linked') {
        errorMessage = "This phone number is already linked to another account.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Complete profile with city, class, school and set notCompleted=false
  async function handleCompleteProfile(e) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Update profile with remaining info and set notCompleted=false
      await completeUserProfile(user.uid, {
        city,
        class: schoolClass,
        school
      });

      // If user came from login (completeProfile=true), redirect to dashboard
      if (completeProfile === 'true') {
        router.push('/student/dashboard');
      } else {
        // Otherwise proceed to success step
        setStep(4);
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4 font-outfit">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-[#6B8B23] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#6B8B23] mb-3 font-outfit">
              Signup Complete!
            </h2>
            <p className="text-gray-700 text-lg font-outfit">
              Your account was created successfully. You can now continue to the dashboard.
            </p>
          </div>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="bg-[#FDD355] hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold transition-colors font-outfit"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-white flex flex-col lg:flex-row overflow-scroll font-outfit">
      {/* Left side - Form (Desktop: Left, Mobile: Top) */}
      <div className="order-1 lg:order-1 w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 lg:pr-6">
        <div className="w-full max-w-xl">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 h-1 rounded-full">
              <div 
                className="bg-[#FDD355] h-1 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center font-outfit">
              Step {step} of 3
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-2 font-outfit">
            {step === 1 ? "Sign up to Skill Set Go" : step === 2 ? "Enter the OTP Sent to" : "Tell us more about yourself"}
          </h2>
          
          {step === 2 && (
            <p className="text-sm text-gray-600 mb-4 font-outfit">{getE164Phone()}</p>
          )}

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded mb-4 text-sm font-outfit">
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4 font-outfit">
              <div>
                <label className="block text-lg font-medium mb-1 font-outfit">Full Name*</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                  placeholder="Kevin Babu"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-1 font-outfit">Email Address*</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                  placeholder="kevin@example.com"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 font-outfit">Phone Number*</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-3 border border-gray-300 rounded bg-gray-50 text-gray-700 font-outfit">
                    +91
                  </div>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="flex-1 border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                    placeholder="2255"
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
                <p className="text-xs text-[#6B8B23] mt-1 font-outfit">Enter 10-digit mobile number</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-outfit">Create Password*</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>

              <div id={recaptchaContainerId} className="mt-2" />

              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-[#FDD355] hover:bg-yellow-500 disabled:bg-gray-300 text-black px-4 py-3 rounded font-semibold transition-colors font-outfit"
                >
                  {loading ? "Checking..." : "Continue"}
                </button>
              </div>

              <p className="text-lg text-center text-gray-600 mt-4 font-outfit">
                Already have an account?{" "}
                <a href="/login" className="text-[#6B8B23] hover:underline font-outfit">
                  Login
                </a>
              </p>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 font-outfit">
              <div>
                <label className="block text-sm font-medium mb-3 font-outfit">Enter OTP</label>
                <div className="flex gap-2 justify-center">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                      required
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center font-outfit">
                Resend OTP in 00:30
              </p>

              <button
                disabled={loading}
                className="w-full bg-[#FDD355] hover:bg-yellow-500 disabled:bg-gray-300 text-black px-4 py-3 rounded font-semibold transition-colors font-outfit"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </form>
          )}

          {/* Step 3: Profile Details */}
          {step === 3 && (
            <form onSubmit={handleCompleteProfile} className="space-y-4 font-outfit">
              <div>
                <label className="block text-sm font-medium mb-1 font-outfit">Your City*</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-outfit">Your Class*</label>
                <select
                  required
                  value={schoolClass}
                  onChange={(e) => setSchoolClass(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                >
                  <option value="">Select your class</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-outfit">Your School*</label>
                <input
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                  placeholder="Delhi Public School"
                />
              </div>
              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-[#FDD355] hover:bg-yellow-500 disabled:bg-gray-300 text-black px-4 py-3 rounded font-semibold transition-colors font-outfit"
                >
                  {loading ? "Completing..." : "Go to Dashboard"}
                </button>
              </div>
            </form>
          )}

          {/* Contact Us Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 font-outfit">
            <p className="text-sm font-semibold mb-2 font-outfit">Contact Us</p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 font-outfit">
                <span className="text-[#6B8B23]">📞</span>
                <span>+91 7306576204</span>
              </div>
              <div className="flex items-center gap-2 font-outfit">
                <span className="text-orange-600">📧</span>
                <span>info@skillsetgo.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Banner Image (Desktop: Right, Mobile: Bottom) */}
      <div className="order-2 lg:order-2 lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="relative w-full h-64 lg:h-full max-w-lg mx-auto">
          <Image
            src="/images/signup/signupbanner.png"
            alt="Signup Banner"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
