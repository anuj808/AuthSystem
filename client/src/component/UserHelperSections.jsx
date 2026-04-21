import React from "react";
import { useNavigate } from "react-router-dom";
import helper1 from "../assets/helper1.png";
import helper2 from "../assets/helper2.png";
import helper3 from "../assets/helper3.png";
import helper4 from "../assets/helper4.png";
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";
 import user4 from "../assets/user4.png";
const UserHelperSections = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#0d1c1f] text-white py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-28">

        {/* ================= USER SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
              Get Trusted Helpers, <br />
              <span className="text-teal-400">Fast & Hassle-Free</span>
            </h2>

            <div className="w-16 h-1 bg-teal-400 mt-4 mb-6"></div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Book skilled professionals for cleaning, repairs, painting,
              electrical work and more — all at affordable prices near you.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="mt-8 bg-teal-500 hover:bg-teal-600
                         text-white px-8 py-3 rounded-full
                         transition-all duration-300"
            >
              Book a Service →
            </button>
          </div>

          {/* Right Images */}
          {/* Left Images (Helper Section) */}
<div className="grid grid-cols-2 gap-4">
  <img src={helper1} className="rounded-xl" />
  <img src={helper2} className="rounded-xl" />
  <img src={helper3} className="rounded-xl" />
  <img src={helper4} className="rounded-xl" />
</div>

        </div>

        {/* ================= HELPER SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Left Images */}
         {/* Right Images (User Section) */}
<div className="grid grid-cols-2 gap-4">
  <img src={user1} className="rounded-xl" />
  <img src={user2} className="rounded-xl" />
  <img src={user3} className="rounded-xl" />
  <img src={user4} className="rounded-xl" />
</div>


          {/* Right Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
              Work on Your Terms & <br />
              <span className="text-teal-400">Earn More as a Helper</span>
            </h2>

            <div className="w-16 h-1 bg-teal-400 mt-4 mb-6"></div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Register as a ServiceCo helper and get jobs near your location.
              Flexible working hours, secure payments, and real earning
              opportunities.
            </p>

            <button
              onClick={() => navigate("/register-helper")}
              className="mt-8 border border-teal-400 text-teal-300
                         hover:bg-teal-500 hover:text-white
                         px-8 py-3 rounded-full
                         transition-all duration-300"
            >
              Register as Helper →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UserHelperSections;
