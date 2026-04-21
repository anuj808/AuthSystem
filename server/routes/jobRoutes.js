import express from "express";
import { createJob, getJobStatus, getAvailableJobs, acceptJob, increaseFare, cancelJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/create", createJob);
router.get("/status/:id", getJobStatus);
router.get("/available", getAvailableJobs);
router.post("/accept", acceptJob);
router.put("/increase/:id", increaseFare);
router.put("/cancel/:id", cancelJob);

export default router;
