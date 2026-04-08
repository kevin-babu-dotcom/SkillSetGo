'use client';

import Link from 'next/link';
import Image from 'next/image'


export default function SchoolsPricingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-outfit">
          Launch Your Career Journey - Simple, Transparent Plans
        </h1>
        
        {/* Plan Toggle */}
        <div className="flex justify-center mt-6 space-x-4 relative">
          <Link href="/pricing/students" className="bg-[#FFF8E8] px-12 py-2 rounded-full font-medium flex items-center justify-start relative font-outfit">
            <Image src="/images/pricing/pricing-students.png" alt="For Students" width={50} height={55} className="rounded-full absolute left-0 -mx-1" />
            <span>For Students</span>
          </Link>
          <Link href="/pricing/schools" className="bg-[#FFF8E8] border-[3px] border-[#942705] px-12 py-2 rounded-full font-medium flex items-center justify-start font-outfit relative">
            <Image src="/images/pricing/pricing-schools.png" alt="For Schools" width={50} height={50} className="rounded-full absolute left-0 -mx-1" />
            <span>For Schools</span>
          </Link>
        </div>
      </div>

      {/* School Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pack 1 - Career Explorer */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-2 text-black font-outfit">Pack 1 - Career Explorer</h3>
            <p className="text-sm text-black mb-4 font-outfit">Introductory Career Assessment & Report Only</p>
            
            <div className="mb-6">
              <div className="text-center">
                <div className="text-[#6B8B23] text-2xl font-bold font-outfit">Classes 8-10: ₹299</div>
                <div className="text-[#6B8B23] text-2xl font-bold font-outfit">Classes 11-12: ₹399</div>
              </div>
            </div>
            
            <div className="text-left mb-6 flex-grow">
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Stream or Course Suggestion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personalized Student Report (PDF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Access to School Dashboard to view all student reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">NEP - aligned structure for school documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Need expert help interpreting your report?</span><br />
                    <span className="">Students will have the option to connect with our certified career guide after completing the test.</span>
                  </div>
                </li>
              </ul>
              <p className="text-xs  mt-3 italic">
                No live sessions or workshops included in this pack.
              </p>
            </div>
            
            <div className="space-y-3 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Download Brochure
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              <button className="w-full bg-[#6B8B23] text-white py-3 rounded-lg font-semibold hover:bg-[#5A7A1A] font-outfit">
                Book This Plan
              </button>
            </div>
          </div>

          {/* Pack 2 - Career Discovery */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-2 text-black font-outfit">Pack 2 - Career Discovery</h3>
            <p className="text-sm text-black mb-4 font-outfit">Assessment + Orientation Sessions + Teacher Support</p>
            
            <div className="mb-6">
              <div className="text-center">
                <div className="text-[#6B8B23] text-2xl font-bold font-outfit">Classes 8-10: ₹499</div>
                <div className="text-[#6B8B23] text-2xl font-bold font-outfit">Classes 11-12: ₹599</div>
              </div>
            </div>
            
            <div className="text-left mb-6 flex-grow">
              <p className="text-sm font-semibold mb-3">Everything in Career Explorer, plus:</p>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">1 Career Orientation Session (online/offline) for students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Orientation support for parents (via handouts and recorded video)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">1 Training Session for school teachers/counsellors on interpreting results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Report-based recommendations to aid mentoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Aligned with NEP 2020 career exploration goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Need expert help interpreting your report?</span><br />
                    <span className="">Students will have the option to connect with our certified career guide after completing the test.</span>
                  </div>
                </li>
              </ul>
              <p className="text-xs  mt-3 italic">
                A perfect blend of testing + guidance for schools starting structured career support
              </p>
            </div>
            
            <div className="space-y-3 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Download Brochure
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              <button className="w-full bg-[#6B8B23] text-white py-3 rounded-lg font-semibold hover:bg-[#5A7A1A] font-outfit">
                Book This Plan
              </button>
            </div>
          </div>

          {/* Pack 3 - Career Ecosystem */}
          <div className="relative">
            {/* Best Offer Banner positioned above this card */}
            <div className="absolute -top-8 left-0 right-0 flex justify-center">
              <span className="bg-[#C7BA60] text-black px-28 py-2  text-sm font-medium font-outfit">
                28.5% Off · Best Value
              </span>
            </div>
            
            <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
              <h3 className="font-bold text-2xl mb-2 text-black font-outfit">Pack 3 - Career Ecosystem</h3>
              <p className="text-sm text-black mb-4 font-outfit">Complete, Long-Term Career Guidance Framework</p>
              
              <div className="mb-6">
                <div className="text-center">
                  <div className="text-[#6B8B23] text-2xl font-bold font-outfit">Classes 8-10: ₹699</div>
                  <div className="text-[#6B8B23] text-2xl font-bold font-outfit">Classes 11-12: ₹799</div>
                </div>
              </div>
              
              <div className="text-left mb-6 flex-grow">
                <ul className="text-sm text-black space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">2 Career Orientation Session (online/offline) for students</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">1 Orientation Support Session (online/offline) for parents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">1 Training Session for school teachers/counsellors on interpreting results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">School branded Certificate of Participation for Students</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">Analytics & Insights Dashboard for School</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">Year-round support for career-related events</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                    <span className="font-semibold">Resources to support SQAAF, CBSE Accreditation & NEP compliance</span>
                  </li>
                </ul>
                <p className="text-xs  mt-3 italic">
                  Best for schools looking to build a full-fledged, NEP-compliant career guidance ecosystem.
                </p>
              </div>
              
              <div className="space-y-3 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                    Download Brochure
                  </button>
                  <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                    Talk to Our Team
                  </button>
                </div>
                <button className="w-full bg-[#6B8B23] text-white py-3 rounded-lg font-semibold hover:bg-[#5A7A1A] font-outfit">
                  Book This Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}