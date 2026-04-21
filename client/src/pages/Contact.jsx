import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/contact/send",
        formData
      );
      toast.success(res.data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-400">
            Contact Us
          </h1>
          <p className="text-gray-400 mt-3">
            Have a question or need help? Reach out to us anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Info */}
          <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-300 mb-4">
              Our support team is always ready to help you with services,
              bookings, or general queries.
            </p>
            <p className="text-gray-400 space-y-2">
              📧 support@serviceco.com <br />
              📞 +91 98765 43210 <br />
              📍 India
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40 space-y-4"
          >
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0d1c1f]
              border border-teal-700 text-white"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0d1c1f]
              border border-teal-700 text-white"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#0d1c1f]
              border border-teal-700 text-white"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-full
              bg-teal-500 text-black font-semibold
              hover:bg-teal-400 transition"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;
