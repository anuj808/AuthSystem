import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);
  const [menuOpen, setMenuOpen] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

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
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50
      w-[100%] max-w-7xl
      bg-[#0d1c1f]/70 backdrop-blur-xl
      border border-teal-900/40
      rounded-full shadow-lg
      px-4 sm:px-8 py-3
      flex items-center justify-between"
    >
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="w-11 h-11 sm:w-14 sm:h-14 bg-[#12292e]
        rounded-full flex items-center justify-center cursor-pointer
        hover:scale-105 transition shadow-md"
      >
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-7 h-7 sm:w-10 sm:h-10 object-contain"
        />
      </div>

      {/* Mobile Hamburger */}
      <div
        className="sm:hidden flex flex-col gap-[6px] cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`w-6 h-[2px] bg-white transition ${
            menuOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`w-6 h-[2px] bg-white transition ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-[2px] bg-white transition ${
            menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </div>

      {/* Menu */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row items-center gap-4 sm:gap-8
        absolute sm:static top-20 right-4
        bg-[#0d1c1f]/95 sm:bg-transparent
        p-4 sm:p-0 rounded-2xl sm:rounded-none
        border border-teal-900/40 sm:border-0
        shadow-lg sm:shadow-none`}
      >
        {/* NAV LINKS */}
        <button
          onClick={() => navigate("/about")}
          className="text-gray-200 hover:text-teal-400 transition text-sm sm:text-base cursor-pointer" 
        >
          About Us
        </button>

        <button
          onClick={() => navigate("/services")}
          className="text-gray-200 hover:text-teal-400 transition text-sm sm:text-base cursor-pointer" 
        >
          Services
        </button>


        <button
          onClick={() => navigate("/contact")}
          className="text-gray-200 hover:text-teal-400 transition text-sm sm:text-base cursor-pointer" 
        >
          Contact Us
        </button>

        <button
          onClick={() => {
            if (userData?.isHelper || userData?.helperVerificationStatus === 'verified') {
               navigate("/helper-dashboard");
            } else {
               navigate("/register-helper");
            }
          }}
          className="text-gray-200 hover:text-teal-400 transition text-sm sm:text-base cursor-pointer font-semibold" 
        >
          {userData?.isHelper || userData?.helperVerificationStatus === 'verified' ? 'Helper Dashboard' : 'Become a Helper'}
        </button>

        <button
          onClick={() => navigate("/admin-dashboard")}
          className="text-emerald-400 hover:text-emerald-300 transition text-sm sm:text-base cursor-pointer font-bold border border-emerald-500/30 px-3 py-1.5 rounded-lg bg-emerald-500/10" 
        >
          Admin
        </button>
        {/* AUTH SECTION */}
        {userData ? (
          <div className="relative group">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11
              flex items-center justify-center
              rounded-full bg-teal-500 text-[#0d1c1f]
              font-bold text-lg cursor-pointer
              hover:bg-teal-400 transition"
            >
              {userData.name[0].toUpperCase()}
            </div>

            {/* Dropdown */}
            <div
              className="absolute hidden group-hover:block top-12 right-0
              bg-[#12292e] border border-teal-900/40
              rounded-xl shadow-xl min-w-[180px] overflow-hidden"
            >
              <ul className="text-sm text-gray-200">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="px-4 py-3 hover:bg-teal-500 hover:text-[#0d1c1f] cursor-pointer transition"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="px-4 py-3 hover:bg-red-500 hover:text-white cursor-pointer transition"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border border-teal-400 text-teal-300
            rounded-full px-6 py-2 text-sm sm:text-base
            hover:bg-teal-500 hover:text-[#0d1c1f]
            transition w-full sm:w-auto"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
