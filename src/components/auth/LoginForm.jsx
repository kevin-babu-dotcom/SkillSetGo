"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    loginWithEmailPassword,
    loginWithPhoneOtp,
    setupRecaptcha,
    auth,
} from "@/firebase/auth";
import { getUserProfile } from "@/firebase/firestore";

export default function LoginForm() {
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Email/Password fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Phone OTP fields
    const [phone, setPhone] = useState(""); // Stores only the 10 digits
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    const recaptchaContainerId = "login-recaptcha-container";
    const recaptchaVerifierRef = useRef(null);

    useEffect(() => {
        return () => {
        recaptchaVerifierRef.current = null;
        };
    }, []);

    // Handle phone number input - normalize to 10 digits only
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, "");
        // Limit to 10 digits
        const limitedDigits = digitsOnly.slice(0, 10);
        setPhone(limitedDigits);
    };

  // Get E.164 formatted phone number for Firebase
    const getE164Phone = () => {
        if (phone.length !== 10) {
        throw new Error("Phone number must be exactly 10 digits");
        }
        return `+91${phone}`;
    };

    // Check profile completion and redirect accordingly
    async function handlePostLogin(user) {
        try {
        const profile = await getUserProfile(user.uid);
        
        if (profile && profile.notCompleted === true) {
            // Profile incomplete - redirect to step 3 of signup
            router.push("/signup?completeProfile=true");
        } else {
            // Profile complete - redirect to dashboard
            router.push("/student/dashboard");
        }
        } catch (err) {
        console.error("Error checking profile:", err);
        // If error, default to dashboard
        router.push("/student/dashboard");
        }
    }

    // Handle email/password login
    async function handleEmailLogin(e) {
        e?.preventDefault();
        setError("");
        setLoading(true);

        try {
        const userCredential = await loginWithEmailPassword(email, password);
        await handlePostLogin(userCredential.user);
        } catch (err) {
        console.error("Email login error:", err);
        
        let errorMessage = err?.message || "Login failed";
        
        if (err.code === "auth/user-not-found") {
            errorMessage = "No account found with this email.";
        } else if (err.code === "auth/wrong-password") {
            errorMessage = "Incorrect password.";
        } else if (err.code === "auth/invalid-email") {
            errorMessage = "Invalid email address.";
        } else if (err.code === "auth/user-disabled") {
            errorMessage = "This account has been disabled.";
        } else if (err.code === "auth/invalid-credential") {
            errorMessage = "Invalid email or password.";
        }
        
        setError(errorMessage);
        } finally {
        setLoading(false);
        }
    }

    // Handle phone OTP - send OTP
    async function handleSendOtp(e) {
        e?.preventDefault();
        setError("");
        setLoading(true);

        try {
        // Validate phone number length
        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            setLoading(false);
            return;
        }

        const verifier = setupRecaptcha(recaptchaContainerId);
        recaptchaVerifierRef.current = verifier;
        
        const e164Phone = getE164Phone();
        const confirmResult = await loginWithPhoneOtp(e164Phone, verifier);
        setConfirmationResult(confirmResult);
        setOtpSent(true);
        } catch (err) {
        console.error("Send OTP error:", err);
        
        let errorMessage = err?.message || "Failed to send OTP";
        
        if (err.code === "auth/invalid-phone-number") {
            errorMessage = "Invalid phone number format. Please include country code (e.g., +91).";
        } else if (err.code === "auth/too-many-requests") {
            errorMessage = "Too many attempts. Please try again later.";
        } else if (err.code === "auth/user-disabled") {
            errorMessage = "This account has been disabled.";
        }
        
        setError(errorMessage);
        } finally {
        setLoading(false);
        }
    }

    // Handle phone OTP - verify OTP
    async function handleVerifyOtp(e) {
        e?.preventDefault();
        setError("");
        setLoading(true);

        try {
        if (!confirmationResult) throw new Error("No confirmation result");
        
        const result = await confirmationResult.confirm(otpCode);
        await handlePostLogin(result.user);
        } catch (err) {
        console.error("Verify OTP error:", err);
        
        let errorMessage = err?.message || "OTP verification failed";
        
        if (err.code === "auth/invalid-verification-code") {
            errorMessage = "Invalid OTP code. Please check and try again.";
        } else if (err.code === "auth/code-expired") {
            errorMessage = "OTP code has expired. Please request a new one.";
        }
        
        setError(errorMessage);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-outfit">
        {/* Left side - Banner Image (Desktop: Left, Mobile: Bottom) */}
        <div className="order-2 lg:order-1 lg:flex lg:w-1/2 bg-white items-center justify-center p-6 lg:p-12">
            <div className="relative w-full h-64 lg:h-full max-w-lg mx-auto">
            <Image
                src="/images/signup/signupbanner.png"
                alt="Login Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
            />
            </div>
        </div>

        {/* Right side - Login Form (Desktop: Right, Mobile: Top) */}
        <div className="order-1 lg:order-2 w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 lg:pl-6">
            <div className="w-full max-w-2xl">
            <h2 className="text-4xl font-bold mb-3 font-outfit">Welcome back!</h2>
            <p className="text-gray-600 mb-8 text-lg font-outfit">Let's continue your journey to the right career.</p>

            {/* Login Method Toggle */}
            <div className="flex gap-4 mb-8">
                <button
                onClick={() => {
                    setLoginMethod("email");
                    setError("");
                    setOtpSent(false);
                }}
                className={`flex-1 py-4 text-lg rounded font-semibold transition-colors font-outfit ${
                    loginMethod === "email"
                    ? "bg-[#6B8B23] text-white"
                    : "bg-[#FDD355] text-black hover:bg-yellow-500"
                }`}
                >
                Login with Password
                </button>
                <button
                onClick={() => {
                    setLoginMethod("phone");
                    setError("");
                    setOtpSent(false);
                }}
                className={`flex-1 py-4 text-lg rounded font-semibold transition-colors font-outfit ${
                    loginMethod === "phone"
                    ? "bg-[#6B8B23] text-white"
                    : "bg-[#FDD355] text-black hover:bg-yellow-500"
                }`}
                >
                Login with OTP
                </button>
            </div>

            {error && (
                <div className="text-red-600 bg-red-50 p-4 rounded mb-6 text-base font-outfit">
                {error}
                </div>
            )}

            {/* Email/Password Login Form */}
            {loginMethod === "email" && (
                <form onSubmit={handleEmailLogin} className="space-y-6 font-outfit">
                <div>
                    <label className="block text-base font-medium mb-2 font-outfit">Email Address</label>
                    <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-[#6B8B23] p-4 rounded text-base focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                    placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-base font-medium mb-2 font-outfit">Password</label>
                    <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-[#6B8B23] p-4 rounded text-base focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                    placeholder="Enter your password"
                    minLength={6}
                    />
                </div>
                <div className="text-right">
                    <a href="/forgot-password" className="text-base text-[#6B8B23] hover:underline font-outfit">
                    Forget Password?
                    </a>
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-[#FDD355] hover:bg-yellow-500 disabled:bg-gray-300 text-black px-4 py-4 text-lg rounded font-semibold transition-colors font-outfit"
                >
                    {loading ? "Logging in..." : "Continue"}
                </button>
                </form>
            )}

            {/* Phone OTP Login Form */}
            {loginMethod === "phone" && !otpSent && (
                <form onSubmit={handleSendOtp} className="space-y-6 font-outfit">
                <div>
                    <label className="block text-base font-medium mb-2 font-outfit">
                    Phone Number
                    </label>
                    <div className="flex items-center border-2 border-[#6B8B23] rounded overflow-hidden focus-within:ring-2 focus-within:ring-[#FDD355] focus-within:border-transparent">
                    <span className="bg-gray-100 px-4 py-4 text-gray-700 font-semibold border-r border-[#6B8B23] font-outfit text-base">
                        +91
                    </span>
                    <input
                        required
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="flex-1 p-4 outline-none font-outfit text-base"
                        placeholder="9876543210"
                        maxLength={10}
                        pattern="[0-9]{10}"
                    />
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-outfit">
                    Enter your 10-digit mobile number
                    </p>
                </div>

                <div id={recaptchaContainerId} className="mt-2" />

                <button
                    disabled={loading}
                    className="w-full bg-[#FDD355] hover:bg-yellow-500 disabled:bg-gray-300 text-black px-4 py-4 text-lg rounded font-semibold transition-colors font-outfit"
                >
                    {loading ? "Sending OTP..." : "Continue"}
                </button>
                </form>
            )}

            {/* OTP Verification Form */}
            {loginMethod === "phone" && otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 font-outfit">
                <div className="bg-blue-50 p-4 rounded">
                    <p className="text-base font-outfit">
                    We've sent a verification code to <strong>+91{phone}</strong>
                    </p>
                </div>
                <div>
                    <label className="block text-base font-medium mb-2 font-outfit">
                    Enter 6-digit OTP
                    </label>
                    <input
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full border-2 border-[#6B8B23] p-4 rounded text-center text-3xl tracking-widest focus:ring-2 focus:ring-[#FDD355] focus:border-transparent font-outfit"
                    placeholder="123456"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-[#FDD355] hover:bg-yellow-500 disabled:bg-gray-300 text-black px-4 py-4 text-lg rounded font-semibold transition-colors font-outfit"
                >
                    {loading ? "Verifying..." : "Continue"}
                </button>
                <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-base text-gray-600 hover:text-gray-800 font-outfit"
                >
                    ← Back to phone number
                </button>
                </form>
            )}

            {/* Sign up link */}
            <div className="mt-8 text-center">
                <p className="text-base text-gray-600 font-outfit">
                New to SkillSetGo?{" "}
                <a
                    href="/signup"
                    className="text-[#6B8B23] hover:underline font-semibold font-outfit"
                >
                    Create an Account
                </a>
                </p>
            </div>

            {/* Contact Us Footer */}
            <div className="mt-10 pt-6 border-t border-[#6B8B23] font-outfit">
                <p className="text-base font-semibold mb-3 font-outfit">Contact Us</p>
                <div className="flex flex-col sm:flex-row gap-4 text-base text-gray-600">
                <div className="flex items-center gap-2 font-outfit">
                    <span className="text-[#6B8B23]">📞</span>
                    <span>+91 7306576204</span>
                </div>
                <div className="flex items-center gap-2 font-outfit">
                    <span className="text-[#FDD355]">📧</span>
                    <span>info@skillsetgo.in</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}
