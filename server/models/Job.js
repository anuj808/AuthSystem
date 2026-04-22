import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
    userName: { type: String, default: "User" },
    serviceCategory: { type: String, required: true },
    location: { type: String, required: true },
    distance: { type: String, default: "2.5 km" },
    price: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
    helperId: { type: mongoose.Schema.Types.ObjectId, ref: "Helper", default: null },
    helperName: { type: String, default: "" },
    rating: { type: Number, default: null },
    review: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
