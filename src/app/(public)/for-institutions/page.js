import Image from 'next/image'
import Link from 'next/link'

const Arrow = () => <span className="text-red-600 font-black mr-1 md:mr-2">❯❯</span>

export default function ForInstitutionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Banner */}
      <section className="bg-[#C7BA60] text-black w-full text-center py-2 md:py-4 px-4 md:px-2">
        <h1 className="font-outfit font-semibold text-xs md:text-3xl mb-1 md:mb-2 text-black">
          How It Works
        </h1>
        <p className="text-[10px] md:text-lg leading-snug md:leading-normal mx-auto max-w-3xl text-black">
          Your journey to the right career starts here — simple, structured, and guided every step of the way
        </p>
      </section>

      <main className="flex-1 w-full space-y-4 md:space-y-12 py-4 md:py-10">
        {/* Section 1 */}
        <div className="px-4 md:px-0">
          <Section
            title="Take the Aptitude Test"
            img="/images/howitworks/aptitude.png"
            imgAlt="Aptitude Test"
            button={{ label: "Go to Dashboard", href: "/dashboard" }}
            bullets={[
              "Start by registering on SkillSetGo. If you already have an account, just log in to your dashboard.",
              "Begin with the RAISEC career interest test, available for free as a sample.",
              "Want deeper insights? Unlock the full test to continue.",
              "It only takes about 30 minutes to complete and covers all areas of your personality and career strengths."
            ]}
          />
        </div>

        {/* Section 2 with background */}
        <div className="w-full bg-[#FFF8E8]">
          <div className="px-4 md:px-0">
            <Section
              title="Get Your Detailed Career Report"
              img="/images/howitworks/report.png"
              imgAlt="Career Report"
              button={{ label: "Sample Report", href: "/sample-report" }}
              bullets={[
                "Once you complete the test, your personalized career report will be available in your dashboard.",
                {
                  heading: "The report includes:",
                  sub: [
                    "Career Interests (RAISEC)",
                    "Personality Profile (Big Five Traits)",
                    "Skills & Competencies",
                    "Value System Assessment",
                    "Suggested Ideal Career Paths"
                  ]
                },
                "Explore your strengths and discover careers that truly fit you."
              ]}
            />
          </div>
        </div>

        {/* Section 3 */}
        <div className="px-4 md:px-0">
          <Section
            title="Talk to a Career Coach"
            img="/images/howitworks/coach.png"
            imgAlt="Career Coach"
            button={{ label: "Schedule a Session", href: "/career-coach-booking" }}
            bullets={[
              "Want expert help to understand your report better or discuss your next steps?",
              "You can book a one-on-one session with our certified Career Coaches for personalized guidance.",
              "This is an optional service — perfect for students who need expert insight before making a decision."
            ]}
          />
        </div>

        {/* Section 4 with background */}
        <div className="w-full bg-[#FFF8E8]">
          <div className="px-4 md:px-0">
            <Section
              title="Explore Courses, Exams & Colleges"
              img="/images/howitworks/career.png"
              imgAlt="Career Library"
              button={{ label: "Visit Career Library", href: "/career-library" }}
              bullets={[
                "Use our Career Library to dig deeper into your career path.",
                {
                  heading: "You'll find:",
                  sub: [
                    "Detailed course information",
                    "Required entrance exams",
                    "Top colleges in India and Kerala",
                    "Career options linked to your strengths"
                  ]
                }
              ]}
            />
          </div>
        </div>

        {/* CTA */}
        <section className="w-full text-center pt-4 md:pt-8 px-4 md:px-8">
          <h2 className="font-outfit font-bold text-[10px] md:text-2xl mb-2 md:mb-4 text-black">
            Your Career Journey Starts Here
          </h2>
          <p className="text-[9px] md:text-xl mb-3 md:mb-6 text-black">
            Get Set, Get Going with <span className="text-[#942705]">Skill</span>
            <span className="text-[#6B8B23]">Set</span>
            <span className="text-[#942705]">Go</span>
          </p>
          <Link
            href="/get-started"
            className="inline-block bg-[#FDD355] font-outfit text-black font-bold rounded px-3 py-1 md:px-8 md:py-3 text-[9px] md:text-lg shadow hover:brightness-95"
          >
            Get Started
          </Link>
        </section>
      </main>

    </div>
  )
}

/* Section Component */
function Section({ title, img, imgAlt, button, bullets }) {
  return (
    <section className="w-full max-w-6xl mx-auto md:px-8 py-3 md:py-10">
      <div className="w-full flex flex-row items-start justify-between gap-2 md:gap-12">
        <div className="flex-1">
          <h3 className="font-outfit font-bold text-[11px] md:text-2xl text-black mb-2 md:mb-4">
            {title}
          </h3>
          <ul className="space-y-1 md:space-y-2 text-[9px] md:text-lg leading-snug md:leading-relaxed text-black">
            {bullets.map((b,i) => {
              if (typeof b === 'string') {
                return (
                  <li key={i} className="flex items-start text-black">
                    <Arrow /> <span className="text-black">{b}</span>
                  </li>
                )
              }
              return (
                <li key={i} className="flex flex-col text-black">
                  <div className="flex items-start">
                    <Arrow /> <span className="text-black">{b.heading}</span>
                  </div>
                  <ul className="mt-1 md:mt-2 ml-5 md:ml-8 space-y-1 md:space-y-2">
                    {b.sub.map((s, si) => (
                      <li key={si} className="flex items-start text-black">
                        <span className="font-black mr-1 md:mr-2 text-red-600">❯❯</span>
                        <span className="text-black text-[8px] md:text-base">{s}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-start pt-1 md:pt-4">
          <Image
            src={img}
            alt={imgAlt}
            width={140}
            height={140}
            className="object-contain mb-1 md:mb-4 w-[60px] h-[60px] md:w-[140px] md:h-[140px]"
            quality={100}
            unoptimized
          />
          {button && (
            <Link
              href={button.href}
              className="bg-[#FDD355] text-black font-semibold font-outfit rounded shadow text-[8px] md:text-lg px-2 py-1 md:px-6 md:py-3 hover:brightness-95 text-center"
            >
              {button.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}