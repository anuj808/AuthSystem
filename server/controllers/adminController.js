import Helper from "../models/Helper.js";
import userModel from "../models/userModel.js";
import Contact from "../models/Contact.js";
import Job from "../models/Job.js";

// Get pending helpers
export const getPendingHelpers = async (req, res) => {
  try {
    const helpers = await Helper.find({ isVerified: false }).sort({ createdAt: -1 });
    res.json({ success: true, helpers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify/Reject helper
export const updateHelperStatus = async (req, res) => {
  try {
    const { email, status } = req.body; // status: 'verified' or 'rejected'

    if (!email || !status) {
      return res.status(400).json({ success: false, message: "Email and status required" });
    }

    if (status === 'verified') {
      const helper = await Helper.findOneAndUpdate({ email }, { isVerified: true });
      if (helper && helper.userId) {
         await userModel.findByIdAndUpdate(helper.userId, { isHelper: true, helperVerificationStatus: 'verified' });
      } else {
         await userModel.findOneAndUpdate({ email }, { isHelper: true, helperVerificationStatus: 'verified' });
      }
    } else if (status === 'rejected') {
      const helper = await Helper.findOneAndDelete({ email });
      if (helper && helper.userId) {
         await userModel.findByIdAndUpdate(helper.userId, { isHelper: false, helperVerificationStatus: 'rejected' });
      } else {
         await userModel.findOneAndUpdate({ email }, { isHelper: false, helperVerificationStatus: 'rejected' });
      }
    }

    res.json({ success: true, message: `Helper status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const activeHelpers = await Helper.countDocuments({ isVerified: true });
    
    // Calculate jobs
    const completedJobs = await Job.countDocuments({ status: "completed" });
    const cancelledJobs = await Job.countDocuments({ status: "cancelled" });
    const totalJobs = await Job.countDocuments();

    // Sum payouts (from completed jobs)
    const jobs = await Job.find({ status: "completed" });
    const totalPayouts = jobs.reduce((sum, job) => sum + (job.price || 0), 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeHelpers,
        totalJobs,
        completedJobs,
        cancelledJobs,
        totalPayouts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
