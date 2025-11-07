    export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 font-outfit">Refund Policy</h1>
            <p className="text-gray-600 font-inter">Effective Date: 29th August, 2025</p>
            </div>

            {/* Introduction */}
            <div className="mb-8 text-gray-700 leading-relaxed font-inter">
            <p className="mb-4">
                At SkillSetGo, we strive to provide accurate and valuable career assessment tools 
                for students. Due to the digital nature of our services and the immediate access 
                provided to assessments and personalized reports, we do not offer refunds or returns 
                under any circumstances.
            </p>
            </div>

            {/* Digital Service Policy Section */}
            <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-outfit">Digital Service Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-inter">
                Once a user purchases and accesses any of our career aptitude tests (whether for 
                stream selection, degree guidance, or career path recommendations), the service is 
                considered fully delivered. This includes but is not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4 font-inter">
                <li>Access to the online test</li>
                <li>Generation of a career guidance report</li>
                <li>Any associated content or recommendations</li>
            </ul>
            <p className="text-sm bg-yellow-50 border-l-4 border-[#FDD355] p-4 rounded font-inter">
                As these are non-tangible, personalized services, they cannot be returned, 
                exchanged, or refunded.
            </p>
            </section>

            {/* Exceptional Cases Section */}
            <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-outfit">Exceptional Cases</h2>
            <p className="text-gray-700 leading-relaxed mb-3 font-inter">
                We do not provide refunds for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4 font-inter">
                <li>Change of mind after purchase</li>
                <li>Accidental purchase or duplicate payments (unless proven technical error)</li>
                <li>Dissatisfaction with test results or recommendations</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded font-inter">
                <p className="text-gray-700 leading-relaxed mb-3">
                If you believe there was a technical error during payment or test access, 
                please contact us at{" "}
                <a 
                    href="mailto:info@skillsetgo.in" 
                    className="text-blue-600 hover:underline font-semibold"
                >
                    info@skillsetgo.in
                </a>
                {" "}within 48 hours of the transaction. We will investigate and respond accordingly.
                </p>
                <p className="text-sm text-gray-600">
                However, refund decisions remain at the sole discretion of SkillSetGo and are 
                not guaranteed.
                </p>
            </div>
            </section>

            {/* Contact Us Section */}
            <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-outfit">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-3 font-inter">
                If you have questions or concerns regarding this policy, reach out to us:
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
                This Refund Policy is effective as of the date stated above. 
                We reserve the right to update or modify this policy at any time.
            </p>
            </div>
        </div>
        </div>
    );
    }
