"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/auth";
import { completeUserProfile, getUserProfile } from "@/firebase/firestore";

export default function ProfileComplete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Profile fields
  const [city, setCity] = useState("");
  const [schoolClass, setSchoolClass] = useState("");
  const [school, setSchool] = useState("");

  useEffect(() => {
    // Check if user is authenticated and profile needs completion
    const checkUser = async () => {
      const user = auth.currentUser;
      
      if (!user) {
        // Not logged in, redirect to login
        router.push("/login");
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        
        if (!profile) {
          // No profile exists, redirect to signup
          router.push("/signup");
          return;
        }

        if (profile.notCompleted === false) {
          // Profile already completed, redirect to dashboard
          router.push("/student/dashboard");
          return;
        }

        // Profile exists but not completed, stay on this page
        setCheckingProfile(false);
      } catch (err) {
        console.error("Error checking profile:", err);
        setError("Failed to load profile. Please try again.");
        setCheckingProfile(false);
      }
    };

    checkUser();
  }, [router]);

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
        school,
      });

      // Redirect to dashboard
      router.push("/student/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  }

  if (checkingProfile) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-2">Complete Your Profile</h2>
      <p className="text-gray-600 mb-6">
        Just a few more details to get started!
      </p>

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCompleteProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mumbai"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <input
            required
            value={schoolClass}
            onChange={(e) => setSchoolClass(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10th Grade"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">School</label>
          <input
            required
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Delhi Public School"
          />
        </div>
        <div className="pt-4">
          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-3 rounded font-medium transition-colors"
          >
            {loading ? "Completing profile..." : "Complete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
