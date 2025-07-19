import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#6B8E23] text-white font-inter">
      {/* Mobile Layout */}
      <div className="lg:hidden px-6 py-6">
        {/* Side by side layout for mobile */}
        <div className="grid grid-cols-2 gap-6">
          {/* Contact Us Section - Left Column */}
          <div>
            <h3 className="text-lg font-bold mb-3">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">📞</span>
                <span className="text-sm">+91 7306576204</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">✉️</span>
                <span className="text-sm">info@skillsetgo.in</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">📍</span>
                <span className="text-sm">Fort Kochi</span>
              </div>
            </div>
          </div>

          {/* Useful Links Section - Right Column */}
          <div>
            <h3 className="text-lg font-bold mb-3">Useful Links</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-bold text-xs">❯❯</span>
                <Link href="/privacy" className="hover:underline text-sm">Privacy</Link>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-bold text-xs">❯❯</span>
                <Link href="/terms" className="hover:underline text-sm">Terms</Link>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-bold text-xs">❯❯</span>
                <Link href="/refunds" className="hover:underline text-sm">Refunds</Link>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-bold text-xs">❯❯</span>
                <Link href="/about" className="hover:underline text-sm">About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Keep as is */}
      <div className="hidden lg:block px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-12">
            {/* About Us Section */}
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">About Us</h3>
              <p className="text-lg leading-relaxed mb-4">
                SkillSetGo is a student-focused career guidance platform built to empower 
                young minds in making confident academic and professional choices. 
                Through scientifically designed assessments, expert insights, and 
                personalized support, we help students discover the right stream, course, 
                and college path. Whether you're in school or stepping into college, our tools 
                simplify decisions and open doors to exciting futures. We also partner with 
                schools to deliver impactful guidance programs for students, parents, and 
                teachers. At SkillSetGo, we believe the right direction at the right time can 
                transform lives - <span className="font-bold">Get Set, Get Going</span>
              </p>
            </div>

            {/* Right Column - Links and Contact */}
            <div className="space-y-8">
              {/* Useful Links */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Useful Links</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">❯❯</span>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
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

              {/* Contact Us */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">📞</span>
                    <span>+91 7306576204</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✉️</span>
                    <span>info@skillsetgo.in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}