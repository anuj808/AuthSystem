import Job from "../models/Job.js";

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

