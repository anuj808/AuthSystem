import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((el) => el.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#12292e] px-4 sm:px-6 space-y-6">
      {/* ✅ Logo */}
      <div
        onClick={() => navigate("/")}
        className="w-14 h-14 sm:w-20 sm:h-20 bg-[#12292e] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
      >
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-8 h-8 sm:w-14 sm:h-14 object-contain"
        />
      </div>

      {/* ✅ OTP Form */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md text-center"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Email Verify OTP!
        </h1>
        <p className="text-white/80 text-sm sm:text-base mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <div
          className="flex justify-between gap-2 sm:gap-4 mb-6"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#12292e]"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full bg-[#12292e] text-white py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-transform cursor-pointer"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
