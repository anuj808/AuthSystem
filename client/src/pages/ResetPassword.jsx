import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const inputRefs = useRef([]);

  // Step 1: Send OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // OTP input handling
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const chars = paste.split('');
    chars.forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
  };

  // Step 2: Verify OTP
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join(''));
    setStep(3);
  };

  // Step 3: Reset password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success('Password reset successful!');
        navigate('/login');
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#12292e] px-4 sm:px-6 md:px-8">
      
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-[#12292e] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-xl hover:shadow-2xl mb-6"
      >
        <img src="/logo.svg" alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
      </div>

      {/* STEP 1: Email */}
      {step === 1 && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm text-center space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Your Password</h1>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 sm:p-3 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#12292e]"
          />
          <button
            type="submit"
            className="w-full bg-[#12292e] text-white py-2 sm:py-3 rounded-lg font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            Send OTP
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm text-center space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Verify OTP</h1>
          <div className="flex justify-between mb-4 gap-2 sm:gap-3" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#12292e]"
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full bg-[#12292e] text-white py-2 sm:py-3 rounded-lg font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            Verify
          </button>
        </form>
      )}

      {/* STEP 3: New Password */}
      {step === 3 && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm text-center space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Enter New Password</h1>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 sm:p-3 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#12292e]"
          />
          <button
            type="submit"
            className="w-full bg-[#12292e] text-white py-2 sm:py-3 rounded-lg font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
