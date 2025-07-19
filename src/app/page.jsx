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
      
      {/* Programs Yellow Banner */}
      <ProgramsBanner />
      
      {/* Programs Section */}
      <ProgramsSection />
      
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  )
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 font-outfit lg:py-20 xl:py-24">
      {/* Mobile Layout - Using Grid */}
      <div className="lg:hidden space-y-5">
        {/* Top section: Grid layout */}
        
        <div className=" grid grid-cols-[6fr_3fr]  items-end "> 
          {/* Image - auto width */}
            

          {/* Text + Button - takes remaining space */}
          <div className="grid grid-rows-[1fr_auto]  h-36 gap-2">
            {/* Heading - takes most space */}
            <div className="flex ">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight font-outfit">
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
      <div className="hidden lg:flex  gap-0 justify-center items-center">
        {/* Left Content */}
        <div className=" space-y-6  mx-20 flex-col ">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-outfit">
            Find the Career 
            <span className="block">that fits you Perfectly</span>
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
            className="w-full  max-w-md h-auto object-contain"
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
        <h2 className="text-xl md:text-2xl font-bold text-black font-outfit">
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
      iconPath: "/images/homepagecard1.png"
    },
    {
      title: "Explore Careers Through Stories & Resources", 
      description: "Students can learn about careers through blogs, vlogs, and a rich career library — all in one place.",
      iconPath: "/images/homepagecard2.png"
    },
    {
      title: "Support Schools to Guide Students",
      description: "We work with schools to set up strong career programs in line with the New Education Policy.",
      iconPath: "/images/homepagecard3.png"
    },
    {
      title: "Get Help with College Admissions",
      description: "From choosing a course to getting into college, we guide students every step of the way.",
      iconPath: "/images/homepagecard4.png"
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
              <div className="rounded-lg">
                <Image 
                  src={card.iconPath}
                  alt={`${card.title} icon`}
                  width={200}
                  height={200}
                  className="w-32 h-32 object-contain"
                  quality={100}
                  priority
                  unoptimized={true}
                />
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 leading-tight font-outfit">
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
              <div className="rounded-lg flex items-center justify-center">
                <Image 
                  src={card.iconPath}
                  alt={`${card.title} icon`}
                  width={200}
                  height={200}
                  className="w-32 h-32 object-contain"
                  quality={100}
                  priority
                  unoptimized={true}
                />
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 leading-tight font-outfit">
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

// Programs Banner Component (New)
function ProgramsBanner() {
  return (
    <section className="bg-[#D4B429] py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 font-outfit">
          Our Programs
        </h2>
        <p className="text-black text-lg">
          Career guidance made simple — for students, parents, and schools
        </p>
      </div>
    </section>
  )
}

// Programs Section Component (Updated)
function ProgramsSection() {
  const programs = [
    {
      title: "Stream Selector Test",
      subtitle: "For Classes 8-10",
      description: "Help students choose the right stream after Class 10.",
      highlights: [
        "Assesses aptitude, interest & personality",
        "Recommends the best-fit stream: Science, Commerce, or Humanities",
        "Personalized career suggestions"
      ],
      iconPath: "/images/streamselector.png"
    },
    {
      title: "Degree Explorer Test", 
      subtitle: "For Classes 11-12",
      description: "Guide students in selecting the right degree or course after Class 12.",
      highlights: [
        "Evaluates career goals, strengths, and passions",
        "Matches students with suitable degrees (BSc, BCom, BA, etc.)",
        "Reduces confusion about college options"
      ],
      iconPath: "/images/degreeexplorer.png"
    },
    {
      title: "College Admission Support",
      subtitle: "For Class 12 & above", 
      description: "Help students apply to the right colleges with expert advice.",
      highlights: [
        "One-on-one help with application strategy",
        "College/course shortlisting support",
        "Covers timelines, available entrance, and tips"
      ],
      iconPath: "/images/collegeadmission.png"
    },
    {
      title: "Career Guidance Sessions",
      subtitle: "For Students",
      description: "Interactive sessions to help students explore career options.",
      highlights: [
        "Covers career myths, trends & possibilities", 
        "Hands-on activities & Q&A",
        "Builds career awareness at the school level"
      ],
      iconPath: "/images/careerguidance.png"
    },
    {
      title: "Career Orientation for Parents",
      subtitle: "For Parents of Classes 8-12",
      description: "Empowers parents to support their child's career journey.",
      highlights: [
        "Clarifies their role in decision-making",
        "Shares trends, options & what not to do", 
        "Builds understanding of 21st-century careers"
      ],
      iconPath: "/images/careerorientation.png"
    },
    {
      title: "Career Awareness for Teachers",
      subtitle: "For School Teachers & Mentors",
      description: "Equip teachers to be career influencers in classrooms.",
      highlights: [
        "Introduces teachers to current career trends",
        "Tips on guiding students during academic decisions",
        "Encourages student-teacher career conversations"
      ],
      iconPath: "/images/careerawareness.png"
    }
  ]

  return (
    <section className="py-12 bg-white font-inter">
      <div className="max-w-7xl mx-auto lg:px-4 px-0">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* For Students Header - White Background */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#942705] font-outfit">For Students</h3>
          </div>
          
          {/* Student Programs with Alternating Backgrounds */}
          <div className="space-y-8 mb-12">
            {programs.slice(0, 3).map((program, index) => (
              <div 
                key={index} 
                className={` p-6 text-center space-y-4 ${
                  index % 2 === 0 ? 'bg-[#FFF8E8]' : 'bg-white'
                }`}
              >
                {/* Title in green */}
                <h4 className="text-2xl font-bold text-[#6B8E23] font-outfit">{program.title}</h4>
                
                {/* Icon - Increased Size */}
                <div className="flex justify-center">
                  <Image 
                    src={program.iconPath}
                    alt={`${program.title} icon`}
                    width={200}
                    height={200}
                    className="w-32 h-32 object-contain" 
                    quality={100}
                    unoptimized={true}
                  />
                </div>
                
                {/* Subtitle */}
                <h5 className="text-xl font-bold text-black font-outfit">{program.subtitle}</h5>
                
                {/* Description - Increased font size */}
                <p className="text-black text-lg">{program.description}</p> {/* Changed from text-base to text-lg */}
                
                {/* Highlights */}
                <div className="text-left">
                  <p className="font-bold text-black mb-2">Highlights:</p>
                  <ul className="space-y-1">
                    {program.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-black text-base font-light flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* For Institutions Header - White Background */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#942705] font-outfit">For Institutions</h3>
          </div>
          
          {/* Institution Programs with Alternating Backgrounds */}
          <div className="space-y-8">
            {programs.slice(3).map((program, index) => (
              <div 
                key={index + 3} 
                className={`rounded-lg p-6 text-center space-y-4 ${
                  index % 2 === 0 ? 'bg-[#FFF8E8]' : 'bg-white'
                }`}
              >
                {/* Same content structure as above */}
                <h4 className="text-2xl font-bold text-[#6B8E23] font-outfit">{program.title}</h4>
                
                {/* Icon - Increased Size */}
                <div className="flex justify-center">
                  <Image 
                    src={program.iconPath}
                    alt={`${program.title} icon`}
                    width={200}
                    height={200}
                    className="w-32 h-32 object-contain" 
                    quality={100}
                    unoptimized={true}
                  />
                </div>
                
                <h5 className="text-xl font-bold text-black font-outfit">{program.subtitle}</h5>
                
                {/* Description - Increased font size */}
                <p className="text-black text-lg">{program.description}</p> {/* Changed from text-base to text-lg */}
                
                <div className="text-left">
                  <p className="font-bold text-black mb-2">Highlights:</p>
                  <ul className="space-y-1">
                    {program.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-black text-base font-light flex items-start">
                        <span className="text-red-600 font-black mr-2">❯❯</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* For Students Header - White Background */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-red-700 font-outfit">For Students</h3>
          </div>
          
          {/* Student Programs with Alternating Backgrounds */}
          <div className="space-y-8 mb-16">
            {programs.slice(0, 3).map((program, index) => (
              <div 
                key={index} 
                className={`p-12 ${
                  index % 2 === 0 ? 'bg-[#FFF8E8]' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-12">
                  {/* Left: Content */}
                  <div className="flex-1 space-y-4">
                    <h4 className="text-3xl font-bold text-[#6B8E23] font-outfit">{program.title}</h4>
                    <h5 className="text-xl font-bold text-black font-outfit">{program.subtitle}</h5>
                    
                    {/* Description - Increased font size */}
                    <p className="text-black text-xl">{program.description}</p> {/* Changed from text-lg to text-xl */}
                    
                    <div>
                      <p className="font-bold text-black mb-3 text-lg">Highlights:</p>
                      <ul className="space-y-2">
                        {program.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-black text-lg font-light flex items-start">
                            <span className="text-red-600 font-black mr-3">❯❯</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Right: Icon - Increased Size */}
                  <div className="flex-shrink-0">
                    <Image 
                      src={program.iconPath}
                      alt={`${program.title} icon`}
                      width={200}
                      height={200}
                      className="w-40 h-40 object-contain" 
                      quality={100}
                      unoptimized={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* For Institutions Header - White Background */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-red-700 font-outfit">For Institutions</h3>
          </div>
          
          {/* Institution Programs with Alternating Backgrounds */}
          <div className="space-y-8">
            {programs.slice(3).map((program, index) => (
              <div 
                key={index + 3} 
                className={`p-12 ${
                  index % 2 === 0 ? 'bg-[#FFF8E8]' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-12">
                  {/* Same content structure as above */}
                  <div className="flex-1 space-y-4">
                    <h4 className="text-3xl font-bold text-[#6B8E23] font-outfit">{program.title}</h4>
                    <h5 className="text-xl font-bold text-black font-outfit">{program.subtitle}</h5>
                    
                    {/* Description - Increased font size */}
                    <p className="text-black text-xl">{program.description}</p> {/* Changed from text-lg to text-xl */}
                    
                    <div>
                      <p className="font-bold text-black mb-3 text-lg">Highlights:</p>
                      <ul className="space-y-2">
                        {program.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-black text-lg font-light flex items-start">
                            <span className="text-red-600 font-black mr-3">❯❯</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Right: Icon - Increased Size */}
                  <div className="flex-shrink-0">
                    <Image 
                      src={program.iconPath}
                      alt={`${program.title} icon`}
                      width={200}
                      height={200}
                      className="w-40 h-40 object-contain" 
                      quality={100}
                      unoptimized={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}