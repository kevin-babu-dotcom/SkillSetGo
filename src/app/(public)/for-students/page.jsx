import Image from 'next/image'
import Link from 'next/link'

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#C7BA60] text-black py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-3xl font-semibold mb-2 font-outfit">
            How It Works
          </h1>
          <p className="text-lg mb-2">
            Your journey to the right career starts here — simple, structured, and guided  every step of the way
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w mx-auto  py-8">
        
        {/* Take the Aptitude Test */}
        <section className=" items-center justify-center py-12 px-20">
          <div className="flex flex-col md:flex-row items-start gap-20">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Take the Aptitude Test
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-red-600  font-black mr-2">❯❯</span>
                  <span className='text-xl'>Start by registering on SkillSetGo. If you already have an account, just log in to your dashboard.</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span className='text-xl'>Begin with the RAISEC career interest test, available for free as a sample.</span>
                </li>
                <li className="flex items-center ">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span className='text-xl'>Want deeper insights? Unlock the full test to continue.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span className='text-xl'>It only takes about 30 minutes to complete and covers all areas of your personality and career strengths.</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-48 flex flex-col items-center justify-center">
              <Image
                src="/images/howitworks/aptitude.png"
                alt="Go to Dashboard Illustration"
                width={140}
                height={140}
                className="w-42 h-42 object-contain m-5"
                quality={100}
                unoptimized={true}
              />
              <div className="p-2" />
              <Link
                href="/dashboard"
                className="bg-[#FDD355] text-black px-6 py-4 rounded font-semibold text-lg text-center block font-outfit"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Get Your Detailed Career Report */}
        <section className="mb-12 flex items-center justify-center p-16 bg-[#FFF8E8] ">
          <div className="flex flex-col md:flex-row items-center justify-center gap-20">
            <div className="w-full md:w-48 flex flex-col items-center justify-center">
              <Image
                src="/images/howitworks/report.png"
                alt="Sample Report Illustration"
                width={140}
                height={140}
                className="w-42 h-42 object-contain m-5"
                quality={100}
                unoptimized={true}
              />
              <div className="p-2" />
              <button className="bg-[#FDD355] text-black px-6 py-4 rounded font-semibold text-lg font-outfit">
                Sample Report
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Get Your Detailed Career Report
              </h2>
              <p className="flex items-start text-gray-700 text-xl mb-4">
                <span className="text-red-600 font-black mr-2">❯❯</span>
                Once your complete the test, your personalized career report will be available in your dashboard.
              </p>
              <ul className="space-y-2 text-gray-700 text-xl">
                <li className="flex text-lg items-start">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span >
                    The report includes:
                    <ul className="space-y-2 ml-8 mt-2">
                      <li className="flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        Career Interests (RAISEC)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        Personality Profile (Big Five Traits)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        Skills & Competencies
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        Value System Assessment
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        Suggested Ideal Career Paths
                      </li>
                    </ul>
                  </span>
                </li>
                <li className="flex items-start text-lg">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span className="text-lg">
                    Explore your strengths and discover careers that truly fit you.
                  </span>
                </li>
              </ul>
            </div>
            
          </div>
        </section>

        {/* Talk to a Career Coach */}
        <section className="mb-12 flex items-center justify-center px-24 py-12 bg-white">
          <div className="flex flex-col md:flex-row items-center justify-center gap-20">
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Talk to a Career Coach
              </h2>
              <ul className="space-y-2 text-gray-700 text-xl p-2">
                <li className="flex items-start">
                  <span className="text-red-600 text-lg font-black mr-2">❯❯</span>
                  <span>Want expert help to understand your report better or discuss your next steps?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 text-lg font-black mr-2">❯❯</span>
                  <span >You can book a one-on-one session with our certified Career Coaches for personalized guidance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 text-lg font-black mr-2">❯❯</span>
                  <span>This is an optional service — perfect for students who need expert insight before making a decision.</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-48 flex flex-col items-center justify-center">
              <Image
                src="/images/howitworks/coach.png"
                alt="Career Coach Illustration"
                width={120}
                height={120}
                className="w-42 h-42 object-contain mb-4"
                quality={100}
                unoptimized={true}
              />
              <div className="p-2" />
              <Link
                href="/career-coach-booking"
                className="bg-[#FDD355] text-black px-4 py-2 rounded font-semibold text-lg text-center block font-outfit"
              >
                Schedule a Session
              </Link>
            </div>
          </div>
        </section>

        {/* Explore Courses, Exams & Colleges */}
        <section className="mb-12 flex items-center justify-center p-20 bg-[#FFF8E8]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-40">
            <div className="w-full md:w-48 flex flex-col items-center justify-center">
              <Image
                src="/images/howitworks/career.png"
                alt="Career Library Illustration"
                width={120}
                height={120}
                className="w-42 h-42 object-contain mb-4"
                quality={100}
                unoptimized={true}
              />
              <div className="p-2" />
              <Link
                href="/career-library"
                className="bg-[#FDD355] text-black px-3 py-4 rounded font-semibold text-lg text-center block font-outfit"
              >
                Visit Career Library
              </Link>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Explore Courses, Exams & Colleges
              </h2>
              <ul className="space-y-2 text-gray-700 text-xl">
                <li className="flex items-start">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span >Use our Career Library to dig deeper into your career path.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-black mr-2">❯❯</span>
                  <span >The library includes:</span>
                </li>
                <ul className="space-y-2 ml-8 mt-2">
                  <li className="flex items-start">
                    <span className="text-red-600 font-black mr-2">❯❯</span>
                    Detailed course information
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-black mr-2">❯❯</span>
                    Required entrance exams
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-black mr-2">❯❯</span>
                    Top colleges in India and Kerala
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-black mr-2">❯❯</span>
                    Career options linked to your strengths
                  </li>
                </ul>
              </ul>
            </div>
          </div>
        </section>

        {/* Your Career Journey Starts Here */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
            Your Career Journey Starts Here
          </h2>
          <p className="text-black text-xl mb-6">
            Get Set, Get Going with <span className="text-[#942705]">Skill</span><span className="text-[#6B8B23] ">Set</span><span className="text-[#942705]">Go</span>
          </p>
          <Link 
            href="/get-started"
            className="inline-block font-outfit bg-[#FDD355] text-black px-8 py-3 rounded-lg font-bold text-lg hover:border transition-colors font-outfit"
          >
            Get Started
          </Link>
        </section>
      </div>

      {/* Footer Section */}
      
    </div>
  )
}