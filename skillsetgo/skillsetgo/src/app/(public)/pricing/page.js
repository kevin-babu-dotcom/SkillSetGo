'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Launch Your Career Journey - Simple, Transparent Plans
        </h1>
        
        {/* Plan Toggle */}
        <div className="flex justify-center mt-6 space-x-2">
          <button className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-medium flex items-center">
            👨‍🎓 For Students
          </button>
          <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-medium flex items-center">
            🏫 For Schools
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stream Fit Test */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Stream Fit Test</h3>
            <div className="text-orange-500 text-4xl font-bold mb-1">₹499</div>
            <p className="text-sm text-gray-600 mb-4">Recommended for Classes 8-10</p>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>» Interest Assessment</li>
                <li>» Personality Profiling</li>
                <li>» Cognitive Abilities Test</li>
                <li>» Personality Profiling</li>
                <li>» Cognitive Abilities Test</li>
                <li>» Stream Recommendations</li>
                <li>» Subject Suggestions & More for Logical and right brained applicants</li>
                <li>» Lifetime access to Student Dashboard</li>
                <li>» Free Career Library Access</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                You'll have full ability to connect with our team with career goals after completing the test.
              </p>
            </div>
            
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 mb-3">
              Take Test Now
            </button>
            <div className="text-center">
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs">Most Popular</span>
            </div>
          </div>

          {/* Degree Explorer Test */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Degree Explorer Test</h3>
            <div className="text-orange-500 text-4xl font-bold mb-1">₹699</div>
            <p className="text-sm text-gray-600 mb-4">Recommended for Classes 11-12</p>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>» Interest Assessment</li>
                <li>» Personality Profiling</li>
                <li>» Cognitive Abilities Test (Preference)</li>
                <li>» Personality Profiling</li>
                <li>» Cognitive Abilities Test</li>
                <li>» Self Efficacy Assessment</li>
                <li>» Subject Suggestions & More for Logical and right brained applicants</li>
                <li>» Comprehensive Career Report (PDF)</li>
                <li>» Lifetime access to Student Dashboard</li>
                <li>» Free Career Library Access</li>
                <li>» Need expert help interpreting your report? 
                    You'll have full ability to connect with our 
                    team with career goals after completing the test.
                </li>
              </ul>
            </div>
            
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 mb-3">
              Take Test Now
            </button>
            <div className="text-center">
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs">Most Popular</span>
            </div>
          </div>

          {/* College Admission Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-xl mb-2 text-gray-800">College Admission Plan</h3>
            <div className="text-orange-500 text-4xl font-bold mb-1">₹1999</div>
            <p className="text-sm text-gray-600 mb-4">Long-term career planning</p>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>» Access All Test</li>
                <li>» Stream Explorer Test</li>
                <li>» 1 to 1 Chat with our Expert (chat only)</li>
                <li>» 1 hr 20 minute video call with our career 
                    counselor to get personalized career guidance 
                    and live Q and A with Questions.
                </li>
                <li>» Comprehensive Career Report (PDF)</li>
                <li>» Detailed analysis for personalized career 
                    admissions and Plan B and C with Options.
                </li>
                <li>» Comprehensive Career Report (PDF)</li>
                <li>» Lifetime access to Student Dashboard</li>
                <li>» Free Career Library Access</li>
              </ul>
            </div>
            
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 mb-3">
              Subscribe Now
            </button>
            <div className="text-center">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded text-xs font-medium">Great Value</span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}