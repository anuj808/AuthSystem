import express from "express";
import {
  registerHelper,
  findNearbyHelpers,
} from "../controllers/helperController.js";
import { upload } from "../middleware/upload.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Register helper
router.post(
  "/register",
  userAuth,
  registerHelper
);

// Find nearby helpers
router.get("/nearby", findNearbyHelpers);

export default router;
