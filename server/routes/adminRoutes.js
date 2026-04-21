import express from "express";
import {
  getPendingHelpers,
  updateHelperStatus,
  getContacts,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/helpers/pending", getPendingHelpers);
router.post("/helpers/status", updateHelperStatus);
router.get("/contacts", getContacts);

export default router;
