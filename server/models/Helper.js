import mongoose from "mongoose";

const helperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    serviceCategory: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    idProofType: {
      type: String,
      enum: ["Aadhaar", "PAN", "Driving License", "Voter ID"],
      required: true,
    },

    idProofImage: {
      type: String, // Cloudinary / local image URL
    },
    profilePhoto: {
  type: String,
},
    isVerified: {
      type: Boolean,
      default: false,
    },

    location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
},
  },
  { timestamps: true }
);
helperSchema.index({ location: "2dsphere" });
export default mongoose.model("Helper", helperSchema);
