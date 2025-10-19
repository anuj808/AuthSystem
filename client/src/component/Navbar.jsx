import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ for mobile menu toggle

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-20 py-3 sm:py-4 bg-[#0d1c1f] shadow-md fixed top-0 left-0 z-50">
      {/* ✅ Logo */}
      <div
        onClick={() => navigate("/")}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-[#12292e] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg"
      >
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
        />
      </div>

      {/* ✅ Hamburger Menu (Mobile) */}
      <div
        className="flex flex-col justify-center items-center gap-[6px] cursor-pointer sm:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`w-6 h-[2px] bg-white transition ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`w-6 h-[2px] bg-white transition ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`w-6 h-[2px] bg-white transition ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </div>

      {/* ✅ Desktop Menu / Mobile Dropdown */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-4 sm:gap-8 absolute sm:static top-16 right-4 sm:right-0 bg-[#0d1c1f] sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none shadow-lg sm:shadow-none`}
      >
        {userData ? (
          <div className="relative group flex justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white text-[#12292e] font-bold text-xl sm:text-2xl cursor-pointer hover:bg-[#12292e] hover:text-white transition duration-300">
              {userData.name[0].toUpperCase()}
            </div>

            {/* ✅ Dropdown Menu */}
            <div className="absolute hidden group-hover:block top-12 right-0 z-50 bg-white rounded-lg shadow-lg min-w-[180px] text-gray-800 overflow-hidden">
              <ul className="py-1 list-none text-sm sm:text-base">
                {!userData.isAccountVerified && (
                  <li
                    className="px-4 py-3 hover:bg-[#12292e] hover:text-white cursor-pointer transition"
                    onClick={sendVerificationOtp}
                  >
                    Verify Email
                  </li>
                )}
                <li
                  className="px-4 py-3 hover:bg-[#12292e] hover:text-white cursor-pointer transition"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 border border-teal-400 text-teal-300 rounded-full px-5 py-2 text-sm sm:text-base hover:bg-teal-500 hover:text-white transition-all cursor-pointer w-full sm:w-auto"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
