import express from "express";
import {
  getPendingHelpers,
  updateHelperStatus,
  getContacts,
  getStats
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/helpers/pending", getPendingHelpers);
router.post("/helpers/status", updateHelperStatus);
router.get("/contacts", getContacts);
router.get("/stats", getStats);

export default router;
