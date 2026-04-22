import Job from "../models/Job.js";
import Razorpay from "razorpay";

// Create a new job request (from user)
export const createJob = async (req, res) => {
  try {
    const { serviceCategory, location, userName, basePrice } = req.body;
    // Set a base price if not provided
    const price = basePrice || 500;
    
    // Clear old pending jobs for this user if we wanted, but let's just create one
    const newJob = await Job.create({
      userId: req.user ? req.user.userId : null,
      userName: userName || "Nearby User",
      serviceCategory,
      location,
      price,
    });
    
    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check job status (from user)
export const getJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available jobs (from helper dashboard)
export const getAvailableJobs = async (req, res) => {
  try {
    // Ideally filter by serviceCategory, but for demo let's fetch all pending
    const jobs = await Job.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept a job (from helper)
export const acceptJob = async (req, res) => {
  try {
    const { jobId, helperId, helperName } = req.body;
    const job = await Job.findById(jobId);
    
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "pending") return res.status(400).json({ success: false, message: "Job already accepted or expired" });
    
    job.status = "accepted";
    job.helperId = helperId || null;
    job.helperName = helperName || "A Professional Helper";
    await job.save();
    
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increase fare (from user)
export const increaseFare = async (req, res) => {
  try {
    const { amount } = req.body; // e.g., 50
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "pending") return res.status(400).json({ success: false, message: "Can only increase fare for pending jobs" });
    
    job.price += (amount || 50);
    await job.save();
    
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel job (from user)
export const cancelJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    
    // Only cancel if pending
    if (job.status !== "pending") return res.status(400).json({ success: false, message: "Only pending jobs can be cancelled" });
    
    job.status = "cancelled";
    await job.save();
    
    res.json({ success: true, message: "Job cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete job (from helper)
export const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "accepted") return res.status(400).json({ success: false, message: "Only accepted jobs can be completed" });
    
    job.status = "completed";
    await job.save();
    
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rate job (from user)
export const rateJob = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "completed") return res.status(400).json({ success: false, message: "Only completed jobs can be rated" });
    
    job.rating = rating;
    job.review = review;
    await job.save();
    
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Payment Link
export const createPaymentLink = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Ensure we have razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID === "rzp_test_your_key_id_here") {
      // Fallback for demo without keys
      return res.json({ success: true, paymentLink: `upi://pay?pa=demo@ybl&pn=Helper&am=${job.price}&cu=INR` });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLink = await instance.paymentLink.create({
      amount: job.price * 100,
      currency: "INR",
      accept_partial: false,
      description: `Payment for Service`,
      customer: {
        name: job.userName || "Customer",
        contact: "+919999999999",
        email: "test@example.com"
      },
      notify: { sms: false, email: false },
      reminder_enable: false
    });

    res.json({ success: true, paymentLink: paymentLink.short_url });
  } catch (error) {
    console.error("Razorpay Error:", error);
    // Fallback if Razorpay API fails (e.g. invalid keys)
    const job = await Job.findById(req.params.id);
    res.json({ success: true, paymentLink: `upi://pay?pa=demo@ybl&pn=Helper&am=${job ? job.price : 0}&cu=INR` });
  }
};

