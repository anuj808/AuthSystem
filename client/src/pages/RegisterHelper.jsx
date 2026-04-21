import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const services = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "AC Technician",
  "Painter",
  "Cleaner",
  "Appliance Repair",
];

const RegisterHelper = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && (userData.isHelper || userData.helperVerificationStatus === 'verified')) {
      navigate("/helper-dashboard");
    }
  }, [userData, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceCategory: "",
    experience: "",
    address: "",
    idProofType: "",
    latitude: 0,
    longitude: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/helpers/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (userData?.helperVerificationStatus === 'pending') {
    return (
      <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4 flex flex-col items-center justify-center pb-24">
        <div className="max-w-md w-full bg-[#12292e] p-8 rounded-2xl border border-teal-500/50 text-center shadow-[0_0_20px_rgba(20,184,166,0.15)] transform hover:-translate-y-1 transition duration-300">
          <div className="text-5xl mb-6">⏳</div>
          <h2 className="text-2xl font-bold text-white mb-3">Application Pending</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your application to become a helper is under review. Please <span className="text-teal-400 font-semibold">wait up to 24 hours</span> for verification from our team. We are checking your submitted details.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-8 px-8 py-2.5 bg-gradient-to-r from-teal-500 to-teal-400 text-[#0d1c1f] rounded-full font-bold hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4">
      <div className="max-w-xl mx-auto pb-16">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-400">
            Become a Helper
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Submit your basic details to apply
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#12292e] border border-teal-900/40
          rounded-2xl p-6 space-y-4 shadow-xl"
        >
          {/* INPUTS */}
          {[
            ["name", "Full Name"],
            ["email", "Email Address"],
            ["phone", "Phone Number"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg
              bg-[#0d1c1f] border border-teal-700
              text-white placeholder-gray-400"
            />
          ))}

          {/* SERVICE DROPDOWN */}
          <select
            name="serviceCategory"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg
            bg-[#0d1c1f] border border-teal-700 text-white"
          >
            <option value="">Select Service Type</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg
            bg-[#0d1c1f] border border-teal-700 text-white"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            rows="3"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg
            bg-[#0d1c1f] border border-teal-700 text-white"
          />

          {/* ID PROOF */}
          <select
            name="idProofType"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg
            bg-[#0d1c1f] border border-teal-700 text-white"
          >
            <option value="">Select ID Proof Type</option>
            <option value="Aadhaar">Aadhaar Card</option>
            <option value="PAN">PAN Card</option>
            <option value="Driving License">Driving License</option>
            <option value="Voter ID">Voter ID</option>
          </select>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-full font-semibold text-lg
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-teal-500 text-black hover:bg-teal-400"
              } transition flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </>
            ) : (
              "Register as Helper"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterHelper;
