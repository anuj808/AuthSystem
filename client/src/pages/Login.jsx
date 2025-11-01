import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedin, getUserData } = useContext(AppContent);

  // Normalize backend URL to remove trailing slash
  const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1c1f] px-4 sm:px-6">
      <div className="bg-[#12292e] rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-semibold text-teal-400 mb-2">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="flex items-center gap-3 w-full px-4 sm:px-5 py-2.5 rounded-full bg-[#1b3a3f]">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full name"
                required
                className="bg-transparent outline-none text-white flex-1 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
          )}

          <div className="flex items-center gap-3 w-full px-4 sm:px-5 py-2.5 rounded-full bg-[#1b3a3f]">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="bg-transparent outline-none text-white flex-1 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center gap-3 w-full px-4 sm:px-5 py-2.5 rounded-full bg-[#1b3a3f]">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none text-white flex-1 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {state === "Login" && (
            <div className="text-right -mt-2">
              <button
                type="button"
                className="text-xs sm:text-sm text-teal-400 hover:underline cursor-pointer"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 sm:py-2.5 rounded-full mt-4 hover:bg-teal-600 transition duration-300 cursor-pointer shadow-md text-sm sm:text-base"
          >
            {state === "Sign Up" ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-gray-400 text-sm sm:text-base">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="text-teal-400 font-semibold cursor-pointer hover:underline"
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;