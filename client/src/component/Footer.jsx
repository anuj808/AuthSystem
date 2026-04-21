import React from "react";
import { FaXTwitter, FaYoutube, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0d1c1f] text-gray-300">

      {/* ===== Social Icons ===== */}
      <div className="max-w-7xl mx-auto py-10 flex justify-center gap-14 text-3xl">
        <FaXTwitter className="cursor-pointer hover:text-teal-400 transition" />
        <FaYoutube className="cursor-pointer hover:text-teal-400 transition" />
        <FaInstagram className="cursor-pointer hover:text-teal-400 transition" />
      </div>

      <div className="border-t border-teal-900/40"></div>

      {/* ===== Footer Content ===== */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

        {/* Logo & Main Links */}
        <div>
          <div className="mb-6">
            <span className="inline-block bg-teal-500 text-white px-6 py-2 rounded-full font-semibold">
              ServiceCo
            </span>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              "Home",
              "About Us",
              "Careers",
              "Safety",
              "Blog",
              "Press",
              "Privacy Policy",
            ].map((item, index) => (
              <li
                key={index}
                className="hover:text-teal-400 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* User Terms */}
        <div>
          <ul className="space-y-3 text-sm">
            {[
              "User Terms – Home Services",
              "User Terms – Repairs & Maintenance",
              "Corporate Affairs",
            ].map((item, index) => (
              <li
                key={index}
                className="hover:text-teal-400 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Helper Terms */}
        <div>
          <ul className="space-y-3 text-sm">
            {[
              "Helper Terms – Plumbing",
              "Helper Terms – Electrical & Painting",
            ].map((item, index) => (
              <li
                key={index}
                className="hover:text-teal-400 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-teal-900/40"></div>

      {/* ===== Bottom Bar ===== */}
      <div className="text-center text-sm text-gray-400 py-6">
        © {new Date().getFullYear()} ServiceCo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
