import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Yellow Banner */}
      <YellowBanner />
      
      {/* Four Cards Section */}
      <FourCardsSection />
      
      {/* Programs Section */}
      <ProgramsSection />
      
      {/* For Students Section */}
      <ForStudentsSection />
    </div>
  )
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 lg:py-20 xl:py-24">
      {/* Mobile Layout - Using Grid */}
      <div className="lg:hidden space-y-5">
        {/* Top section: Grid layout */}
        
        <div className=" grid grid-cols-[6fr_3fr]  items-end "> 
          {/* Image - auto width */}
            

          {/* Text + Button - takes remaining space */}
          <div className="grid grid-rows-[1fr_auto]  h-36 gap-2">
            {/* Heading - takes most space */}
            <div className="flex ">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Find the Career that fits you 
                <span className="block">Perfectly</span>
              </h1>
            </div>
            {/* Button - auto height */}
            <div>
              <Link 
                href="/get-started"
                className="inline-block bg-[#FDD355] hover:bg-yellow-500 text-black px-3 py-1 rounded-lg font-semibold text-sm transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="overflow-visible z-10 -m-6  ">
            <Image 
              src="/images/chandu.png"  
              alt="SkillSetGo Hero Illustration"
              width={180}
              height={180}
              className="w-[350px] h-auto  object-cover"  // Overflows left and right
              priority
              quality={100}
              unoptimized={true}
            />
            </div>
        </div>
        
        {/* Bottom section: Description */}
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            Take the SkillSetGo Test and find the stream, degree, or career that's the right fit—for you.
          </p>
        </div>

      </div>

      {/* Desktop Layout - Original grid */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Find the Career that fits you 
            <span className="block">Perfectly</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg">
            Take the SkillSetGo Test and find the stream, degree, or career that's the right fit—for you.
          </p>
        </div>
        
        {/* Right Content - Illustration */}
        <div className="flex justify-center lg:justify-end">
          <Image 
            src="/images/chandu.png"  
            alt="SkillSetGo Hero Illustration"
            width={400}
            height={300}
            className="w-full max-w-md h-auto object-contain"
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
      </div>
    </section>
  )
}

// Yellow Banner Component
function YellowBanner() {
  return (
    <section className="bg-[#D4B429] py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-black">
          Transforming Futures with Purposeful Career Guidance
        </h2>
        <p className="text-black mt-2">
          Smart career support for students and schools — clear, simple, and effective
        </p>
      </div>
    </section>
  )
}

// Four Cards Section Component
function FourCardsSection() {
  const cards = [
    {
      title: "Find the Career That Fits You Best",
      description: "We help students figure out which career suits them through simple tests and one-on-one guidance.",
      iconPath: "/icons/career-guidance.png" // Replace with your actual path
    },
    {
      title: "Explore Careers Through Stories & Resources",
      description: "Students can learn about careers through blogs, vlogs, and a rich career library — all in one place.",
      iconPath: "/icons/career-library.png" // Replace with your actual path
    },
    {
      title: "Support Schools to Guide Students",
      description: "We work with schools to set up strong career programs in line with the New Education Policy.",
      iconPath: "/icons/school-support.png" // Replace with your actual path
    },
    {
      title: "Get Help with College Admissions",
      description: "From choosing a course to getting into college, we guide students every step of the way.",
      iconPath: "/icons/college-admissions.png" // Replace with your actual path
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Mobile Layout - Single column, stacked vertically */}
      <div className="lg:hidden space-y-8">
        {cards.map((card, index) => (
          <div key={index} className="text-center space-y-4 max-w-sm mx-auto">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#FDD355] rounded-lg flex items-center justify-center">
                <Image 
                  src={card.iconPath}
                  alt={`${card.title} icon`}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {card.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop Layout - 2x2 grid */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-12">
        {cards.map((card, index) => (
          <div key={index} className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-[#FDD355] rounded-lg flex items-center justify-center">
                <Image 
                  src={card.iconPath}
                  alt={`${card.title} icon`}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {card.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Programs Section Component
function ProgramsSection() {
  return (
    <section className="bg-[#D4B429] py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
          Our Programs
        </h2>
        <p className="text-black text-lg">
          Career guidance made simple — for students, parents, and schools
        </p>
      </div>
    </section>
  )
}

// For Students Section Component
function ForStudentsSection() {
  return (
    <section className="bg-[#F5E6D3] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-8">For Students</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Stream Selector Test
              </h3>
              <p className="text-gray-700 mb-2 font-medium">For Classes 8-10</p>
              <p className="text-gray-700 mb-4">
                Help students choose the right stream after Class 10.
              </p>
              
              <div className="space-y-2">
                <p className="text-black font-medium">Highlights:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>✓ Assesses aptitude, interest & personality</li>
                  <li>✓ Recommends the best fit stream: Science, Commerce, or Humanities</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Content - Illustration */}
          <div className="flex justify-center">
            <div className="w-72 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Student Illustration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}