const About = () => {
  return (
    <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-400">
            About ServiceCo
          </h1>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
            ServiceCo is a modern home-services platform that connects users
            with verified local professionals for reliable, safe, and fast
            household services.
          </p>
        </div>

        {/* Sections */}
        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
            <h2 className="text-xl font-semibold text-teal-300 mb-3">
              Who We Are
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We bridge the gap between customers and skilled local workers
              such as plumbers, electricians, cleaners, and technicians.
              Our platform ensures trust, safety, and quality.
            </p>
          </div>

          <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
            <h2 className="text-xl font-semibold text-teal-300 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To simplify home services while empowering local professionals
              with digital opportunities, fair work, and consistent income.
            </p>
          </div>

          <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
            <h2 className="text-xl font-semibold text-teal-300 mb-3">
              Our Vision
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To become India’s most trusted platform for on-demand household
              services by focusing on reliability, transparency, and quality.
            </p>
          </div>
        </div>

        {/* Why Choose */}
        <div className="mt-14 bg-[#12292e] p-8 rounded-2xl border border-teal-900/40">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4">
            Why Choose ServiceCo?
          </h2>
          <ul className="grid md:grid-cols-2 gap-3 text-gray-300">
            <li>✔ Verified service providers</li>
            <li>✔ Secure & transparent platform</li>
            <li>✔ Easy booking & quick response</li>
            <li>✔ Support for local professionals</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default About;
