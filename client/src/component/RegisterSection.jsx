import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaTools } from "react-icons/fa";

const RegisterSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-transparent py-20 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold">
          Join <span className="text-teal-400">ServiceCo</span> Today
        </h2>
        <div className="w-16 h-1 bg-teal-400 mx-auto mt-4 mb-14"></div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* USER CARD */}
          <div
            className="bg-[#12282c] border border-teal-900/40 rounded-2xl
                       p-10 flex flex-col items-center
                       transition-all duration-300
                       hover:scale-[1.02] hover:border-teal-400"
          >
            <div className="w-16 h-16 rounded-full bg-teal-500/20
                            flex items-center justify-center mb-6">
              <FaUser className="text-3xl text-teal-400" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Register as User
            </h3>

            <p className="text-gray-300 text-sm max-w-xs mb-6">
              Find trusted helpers for home services like plumbing,
              electrical, cleaning, painting and more.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="border border-teal-400 text-teal-300
                         px-8 py-3 rounded-full
                         hover:bg-teal-500 hover:text-white
                         transition-all duration-300"
            >
              Get Started →
            </button>
          </div>

          {/* HELPER CARD */}
          <div
            className="bg-[#12282c] border border-teal-900/40 rounded-2xl
                       p-10 flex flex-col items-center
                       transition-all duration-300
                       hover:scale-[1.02] hover:border-teal-400"
          >
            <div className="w-16 h-16 rounded-full bg-teal-500/20
                            flex items-center justify-center mb-6">
              <FaTools className="text-3xl text-teal-400" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Register as Helper
            </h3>

            <p className="text-gray-300 text-sm max-w-xs mb-6">
              Work on your own schedule, get jobs near your location,
              and earn securely as a ServiceCo helper.
            </p>

            <button
              onClick={() => navigate("/register-helper")}
              className="bg-teal-500 text-white
                         px-8 py-3 rounded-full
                         hover:bg-teal-600
                         transition-all duration-300"
            >
              Start Earning →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
