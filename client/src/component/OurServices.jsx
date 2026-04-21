import React from "react";
import {
  FaTools,
  FaBolt,
  FaPaintRoller,
  FaSnowflake,
  FaBroom,
  FaCouch,
  FaTv,
  FaWrench,
} from "react-icons/fa";

const services = [
  { name: "Plumber", icon: FaWrench },
  { name: "Electrician", icon: FaBolt },
  { name: "Painter", icon: FaPaintRoller },
  { name: "AC Service", icon: FaSnowflake },
  { name: "Cleaning", icon: FaBroom },
  { name: "Carpenter", icon: FaCouch },
  { name: "Appliance Repair", icon: FaTv },
  { name: "Maintenance", icon: FaTools },
];

const OurServices = () => {
  return (
    <section className="w-full py-16 bg-transparent" >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white">
            Our Services
          </h2>
          <div className="w-14 h-1 bg-teal-400 mt-2"></div>
        </div>

        {/* Services */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
            <div
  key={index}
  className="
    bg-[#0d1c1f] border border-[#1f3a3f]
    rounded-xl p-6
    flex flex-col items-center text-center
    transition-all duration-300 ease-in-out
    hover:border-teal-400 hover:bg-[#10272b]
  "
>
  {/* Icon */}
  <div
    className="
      w-14 h-14 flex items-center justify-center rounded-lg
      bg-[#10272b] mb-4
      transition-all duration-300
      group-hover:bg-teal-500/10
    "
  >
    <Icon className="text-2xl text-teal-400" />
  </div>

  {/* Title */}
  <h3 className="text-sm font-medium text-gray-200">
    {service.name}
  </h3>
</div>

            );
          })}
        </div>

      </div>
    </section>
  );
};

export default OurServices;
