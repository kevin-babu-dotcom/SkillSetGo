import Image from 'next/image'
import Link from 'next/link'

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#6B8B23] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-outfit">
            How It Works
          </h1>
          <p className="text-lg mb-2">
            Your journey to the right career starts here — simple, structured, and guided
          </p>
          <p className="text-lg">
            every step of the way
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Take the Aptitude Test */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Take the Aptitude Test
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>Start by registering on SkillSetGo. If you already have an account, just log in to your dashboard.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>Begin with the RAISEC career interest test, available for free as a sample.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>Want deeper insights? Unlock the full test to continue.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>It only takes about 30 minutes to complete and covers all areas of your personality and career strengths.</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-48 flex justify-center">
              <div className="bg-orange-100 rounded-full p-8">
                <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold text-sm">
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Your Detailed Career Report */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Get Your Detailed Career Report
              </h2>
              <p className="text-gray-700 mb-4">
                Once your complete the test, your personalized career report will be available in your dashboard.
              </p>
              <p className="text-gray-700 mb-3 font-semibold">The report includes:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">▶</span>
                  <span>Career Interests (RAISEC)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">▶</span>
                  <span>Personality Profile (Big Five Traits)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">▶</span>
                  <span>Skills & Competencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">▶</span>
                  <span>Value System Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">▶</span>
                  <span>Suggested Ideal Career Paths</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-3">
                Explore your strengths and discover careers that truly fit you.
              </p>
            </div>
            <div className="w-full md:w-48 flex justify-center">
              <div className="bg-green-100 rounded-full p-8">
                <div className="bg-green-600 rounded-lg p-4 text-white text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold text-sm">
                    Sample Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Talk to a Career Coach */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
                Talk to a Career Coach
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>Want expert help to understand your report better or discuss your next steps?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>You can book a one-on-one session with our certified Career Coaches for personalized guidance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6B8B23] mr-2">▶</span>
                  <span>This is an optional service — perfect for students who need expert insight before making a decision.</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-48 flex justify-center">
              <div className="bg-orange-100 rounded-full p-8">
                <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
                  <div className="text-3xl mb-2">👨‍💼</div>
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold text-sm">
                    Schedule a Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Courses, Exams & Colleges */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
            Explore Courses, Exams & Colleges
          </h2>
          <p className="text-gray-700 mb-4">
            Use our Career Library to dig deeper into your career path.
          </p>
          <p className="text-gray-700 mb-3">You'll find:</p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">▶</span>
              <span>Detailed course information</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">▶</span>
              <span>Required entrance exams</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">▶</span>
              <span>Top colleges in India and Kerala</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">▶</span>
              <span>Career options linked to your strengths</span>
            </li>
          </ul>
          <button className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold">
            Visit Career Library
          </button>
        </section>

        {/* Your Career Journey Starts Here */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">
            Your Career Journey Starts Here
          </h2>
          <p className="text-gray-700 mb-6">
            Get Set, Get Going with SkillSetGo
          </p>
          <Link 
            href="/get-started"
            className="inline-block bg-[#6B8B23] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </section>
      </div>

      {/* Footer Section */}
      <section className="bg-[#6B8B23] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-outfit">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">📞</span>
                  <span>+91 7306576204</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✉️</span>
                  <span>info@skillsetgo.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">📍</span>
                  <span>Fort Kochi</span>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-outfit">Useful Links</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❯❯</span>
                  <Link href="/privacy" className="hover:underline">Privacy</Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❯❯</span>
                  <Link href="/about" className="hover:underline">About Us</Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❯❯</span>
                  <Link href="/terms" className="hover:underline">Terms</Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❯❯</span>
                  <Link href="/refunds" className="hover:underline">Refunds</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}