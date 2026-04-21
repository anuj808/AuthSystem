const services = [
  {
    title: "Plumbing Services",
    description:
      "Professional plumbers for leakage repairs, pipe fittings, bathroom installations, and water supply issues.",
    icon: "🚰",
  },
  {
    title: "Electrical Services",
    description:
      "Certified electricians for wiring, switch repairs, appliance installation, and power-related issues.",
    icon: "💡",
  },
  {
    title: "AC Repair & Service",
    description:
      "Expert AC technicians for servicing, gas refilling, installation, and breakdown repairs.",
    icon: "❄️",
  },
  {
    title: "Home Cleaning",
    description:
      "Reliable cleaning professionals for deep cleaning, kitchen, bathroom, and full home cleaning services.",
    icon: "🧹",
  },
  {
    title: "Carpentry Services",
    description:
      "Skilled carpenters for furniture repair, door fitting, modular work, and wood maintenance.",
    icon: "🪚",
  },
  {
    title: "Appliance Repair",
    description:
      "Repair services for washing machines, refrigerators, microwaves, and other household appliances.",
    icon: "🔧",
  },
];

const Services = () => {
  return (
    <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-400">
            Our Services
          </h1>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
            ServiceCo provides a wide range of trusted household services
            delivered by verified professionals at your convenience.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-[#12292e] p-6 rounded-2xl
              border border-teal-900/40 shadow-lg
              transform transition-all duration-300
              hover:-translate-y-2 hover:shadow-teal-500/20"
            >
              {/* Icon */}
              <div
                className="text-4xl mb-4 w-14 h-14 flex items-center justify-center
                rounded-full bg-teal-500/20 text-teal-300
                group-hover:scale-110 transition"
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 text-teal-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Hover Line */}
              <div className="mt-4 h-[2px] w-0 bg-teal-400 transition-all duration-300 group-hover:w-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 bg-[#12292e] p-8 rounded-2xl border border-teal-900/40 text-center">
          <h2 className="text-2xl font-semibold text-teal-300 mb-3">
            Why Choose ServiceCo?
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            All our service providers are background-verified and trained to
            deliver reliable, safe, and high-quality services. We focus on
            transparency, convenience, and customer satisfaction.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Services;
