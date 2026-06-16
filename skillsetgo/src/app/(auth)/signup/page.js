"use client";
import { Suspense } from "react";
import SignupStepper from "@/components/auth/SignupStepper";

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8B23] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading signup details...</p>
        </div>
      </div>
    }>
      <SignupStepper />
    </Suspense>
  );
}
