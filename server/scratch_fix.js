import mongoose from "mongoose";
import "dotenv/config";
import userModel from "./models/userModel.js";
import Helper from "./models/Helper.js";

const fixDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB, performing database reset...");

    // Remove the soft lock by clearing all pending statuses
    await userModel.updateMany({}, { helperVerificationStatus: 'none', isHelper: false });
    
    // Wipe stray helpers to let you start fresh
    await Helper.deleteMany({}); 
    
    console.log("Database reset! You can now register again cleanly.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixDB();
