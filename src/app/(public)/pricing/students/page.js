'use client';

import Link from 'next/link';
import Image from "next/image";


export default function StudentsPricingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-outfit">
          Launch Your Career Journey - Simple, Transparent Plans
        </h1>
        
        {/* Plan Toggle */}
        <div className="flex justify-center mt-6 space-x-4 relative">
          <Link href="/pricing/students" className="bg-[#FFF8E8] border-[3px] border-[#942705] px-12 py-2 rounded-full font-medium flex items-center justify-start relative font-outfit">
            <Image src="/images/pricing/pricing-students.png" alt="For Students" width={50} height={55} className="rounded-full absolute left-0 -mx-1.5" />
            <span>For Students</span>
          </Link>
          <Link href="/pricing/schools" className="bg-[#FFF8E8] px-12 py-2 rounded-full font-medium flex items-center space-x-3 font-outfit relative">
            <Image src="/images/pricing/pricing-schools.png" alt="For Schools" width={50} height={50} className="rounded-full absolute left-0" />
            <span>For Schools</span>
          </Link>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stream Fit Test */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-4 text-black font-outfit">Stream Fit Test</h3>
            <div className="text-[#6B8B23] text-4xl font-bold mb-4 font-outfit">₹499</div>
            <p className="text-lg font-semibold text-black mb-6 font-outfit">Recommended for Classes 8-10</p>
            
            <div className="text-left mb-6 flex-grow">
              <h4 className="font-bold mb-4 text-black text-lg">Includes:</h4>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Interest Assessment</span><br />
                    <span className="text-gray-600">RIASEC Based - Free Preview</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personality Profiling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Cognitive Aptitude Test</span><br />
                    <span className="text-gray-600">Numerical, Verbal, Spatial, Logical</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Self-Efficacy Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Stream Recommendations</span><br />
                    <span className="text-gray-600">Based on multi-factor (4D) analysis</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personalized PDF Report</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Lifetime access to Student Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Free Career Library Access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Need expert help interpreting your report?</span><br />
                    <span className="text-gray-600">You'll have the option to connect with our certified career guide after completing the test.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-auto">
              {/* Two yellow buttons side by side */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Try Free Interest Assessment
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              {/* Green button full width */}
              <button className="w-full bg-[#6B8B23] text-white py-3 rounded-lg font-semibold hover:bg-[#5A7A1A] font-outfit">
                Take Full Test for ₹499
              </button>
            </div>
          </div>

          {/* Degree Explorer Test */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-4 text-black font-outfit">Degree Explorer Test</h3>
            <div className="text-[#6B8B23] text-4xl font-bold mb-4 font-outfit">₹699</div>
            <p className="text-lg font-semibold text-black mb-6 font-outfit">Recommended for Classes 11-12</p>
            
            <div className="text-left mb-6 flex-grow">
              <h4 className="font-bold mb-4 text-black text-lg">Includes:</h4>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Interest Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personality Profiling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Cognitive Abilities Test (Preference)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Self Efficacy Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Subject Suggestions & More for Logical and right brained applicants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Comprehensive Career Report (PDF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Lifetime access to Student Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Free Career Library Access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Need expert help interpreting your report?</span><br />
                    <span className="text-gray-600">You'll have full ability to connect with our team with career goals after completing the test.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-auto">
              {/* Two yellow buttons side by side */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Try Free Interest Assessment
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              {/* Green button full width */}
              <button className="w-full bg-[#6B8B23] text-white py-3 rounded-lg font-semibold hover:bg-[#5A7A1A] font-outfit">
                Take Full Test for ₹699
              </button>
            </div>
          </div>

          {/* College Admission Plan */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-4 text-black font-outfit">College Admission Plan</h3>
            <div className="text-[#6B8B23] text-4xl font-bold mb-4 font-outfit">₹1999</div>
            <p className="text-lg font-semibold text-black mb-6 font-outfit">Long-term career planning</p>
            
            <div className="text-left mb-6 flex-grow">
              <h4 className="font-bold mb-4 text-black text-lg">Includes:</h4>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Access All Test</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Stream Explorer Test</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">1 to 1 Chat with our Expert (chat only)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">1 hr 20 minute video call with our career counselor</span><br />
                    <span className="text-gray-600">to get personalized career guidance and live Q and A with Questions.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Comprehensive Career Report (PDF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Detailed analysis for personalized career</span><br />
                    <span className="text-gray-600">admissions and Plan B and C with Options.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Lifetime access to Student Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Free Career Library Access</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-auto">
              {/* Two yellow buttons side by side */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Try Free Interest Assessment
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              {/* Green button full width */}
              <button className="w-full bg-[#6B8B23] text-white py-3 rounded-lg font-semibold hover:bg-[#5A7A1A] font-outfit">
                Subscribe for ₹1999
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}