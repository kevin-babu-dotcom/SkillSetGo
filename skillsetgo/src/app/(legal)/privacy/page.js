export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-outfit">Privacy Policy</h1>
          <p className="text-gray-600 font-inter">Last Updated: 29th August, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-8 text-gray-700 leading-relaxed font-inter">
          <p className="mb-4">
            SkillSetGo ("we," "us," or "our") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you visit our website{" "}
            <a 
              href="https://skillsetgo.in" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://skillsetgo.in
            </a>
            , use our career assessment services, or otherwise engage with us.
          </p>
          <p className="text-sm bg-yellow-50 border-l-4 border-[#FDD355] p-4 rounded">
            By accessing or using our Services, you agree to this Privacy Policy. 
            If you do not agree with the terms, please do not access the Site.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">1. Changes to this Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed font-inter">
            We may update this policy as our services evolve or to meet legal requirements. 
            We will post the revised policy on our site with a new "Last Updated" date.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">2. What Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800 font-outfit">Information You Provide Directly</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2 ml-4 font-inter">
            <li>Name, age, class/grade, and school/college details.</li>
            <li>Email address and phone number (for account setup or communication).</li>
            <li>Responses to our aptitude tests and assessments.</li>
            <li>Any queries or communication through contact forms or emails.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-gray-800 font-outfit">Information We Collect Automatically</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2 ml-4 font-inter">
            <li>Device and browser data (e.g., IP address, browser type, usage patterns).</li>
            <li>Cookies and usage tracking to improve site performance and user experience.</li>
          </ul>

          <p className="text-sm bg-blue-50 border-l-4 border-blue-500 p-4 rounded font-inter">
            We do not knowingly collect data from users under 13 without verifiable parental consent.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-inter">
            <li>To administer career tests and generate personalized reports.</li>
            <li>To provide guidance based on assessment results.</li>
            <li>To communicate with you regarding your account or services.</li>
            <li>To improve our tests and platform experience.</li>
            <li>To comply with legal obligations or protect against misuse or fraud.</li>
          </ul>
          <p className="mt-4 text-sm bg-[#6B8B23] border-l-4 border-[#6B8B23] p-4 rounded font-inter">
            We do not sell or share your personal information for advertising purposes.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">4. Cookies and Analytics</h2>
          <p className="text-gray-700 leading-relaxed mb-3 font-inter">
            We use cookies to remember your preferences and understand how you use our site. 
            You can disable cookies via your browser settings, but some features may not work as expected.
          </p>
          <p className="text-gray-700 leading-relaxed font-inter">
            We may also use tools like Google Analytics to measure engagement and improve the site.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">5. Data Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-3 font-inter">
            We may share your information with:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-3 font-inter">
            <li>Technology service providers for hosting or analytics (e.g., web servers, email services).</li>
            <li>Educational consultants or advisors (only with your or your guardian's consent).</li>
            <li>Legal authorities if required by law.</li>
          </ul>
          <p className="text-sm bg-gray-50 border-l-4 border-gray-400 p-4 rounded font-inter">
            We do not engage in third-party marketing or targeted advertising.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">6. Use of Media and Images</h2>
          <p className="text-gray-700 leading-relaxed font-inter">
            Some images and visuals displayed on our website are AI-generated and are used only 
            for representational purposes. They do not depict actual individuals, staff, students, 
            or partner institutions.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">7. Data Retention and Security</h2>
          <p className="text-gray-700 leading-relaxed font-inter">
            We retain your data only for as long as necessary to provide our services or meet 
            legal obligations. We use standard encryption and security protocols to protect your 
            data, though no system is 100% secure.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">8. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3 font-inter">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4 font-inter">
            <li>Access your personal data.</li>
            <li>Correct or update your information.</li>
            <li>Request deletion of your data.</li>
            <li>Withdraw consent (where applicable).</li>
          </ul>
          <p className="text-gray-700 leading-relaxed font-inter">
            To exercise your rights, contact us at:{" "}
            <a 
              href="mailto:info@skillsetgo.in" 
              className="text-blue-600 hover:underline font-semibold"
            >
              info@skillsetgo.in
            </a>
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">9. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed font-inter">
            Our services are intended for students typically aged 13 and above, and we operate 
            under the assumption that parents, schools, or guardians supervise younger users. 
            If you are a parent and believe your child has provided us data without your consent, 
            contact us to request deletion.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-outfit">10. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-3 font-inter">
            If you have questions or requests regarding this Privacy Policy, you can contact us at:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 font-inter">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Email:</span>
                <a 
                  href="mailto:info@skillsetgo.in" 
                  className="text-blue-600 hover:underline"
                >
                  info@skillsetgo.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Website:</span>
                <a 
                  href="https://skillsetgo.in" 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://skillsetgo.in
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center font-inter">
            This Privacy Policy is effective as of the date stated above and will remain in effect 
            except with respect to any changes in its provisions in the future.
          </p>
        </div>
      </div>
    </div>
  );
}
