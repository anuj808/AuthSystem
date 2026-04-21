import Helper from "../models/Helper.js";
import userModel from "../models/userModel.js";

/**
 * REGISTER HELPER
 */
export const registerHelper = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      serviceCategory,
      experience,
      address,
      idProofType,
      latitude,
      longitude,
    } = req.body;

    // Images omitted for simplicity during testing

    const helper = await Helper.create({
      userId: req.user.userId,
      name,
      email,
      phone,
      serviceCategory,
      experience,
      address,
      idProofType,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // IMPORTANT: [lng, lat]
      },
    });

    const user = await userModel.findById(req.user.userId);
    if(user) {
      user.helperVerificationStatus = 'pending';
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Helper registered successfully",
      helper,
    });
  } catch (error) {
    console.error("REGISTER HELPER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * FIND NEARBY HELPERS (GPS BASED)
 */
export const findNearbyHelpers = async (req, res) => {
  try {
    const { latitude, longitude, serviceCategory } = req.query;

    if (!latitude || !longitude || !serviceCategory) {
      return res.status(400).json({
        success: false,
        message: "Latitude, longitude and serviceCategory are required",
      });
    }

    const helpers = await Helper.find({
      serviceCategory,
      isVerified: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000, // 5 KM
        },
      },
    });

    res.status(200).json({
      success: true,
      helpers,
    });
  } catch (error) {
    console.error("FIND NEARBY HELPERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
