import express from "express";
import { createJob, getJobStatus, getAvailableJobs, acceptJob, increaseFare, cancelJob, completeJob, rateJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/create", createJob);
router.get("/status/:id", getJobStatus);
router.get("/available", getAvailableJobs);
router.post("/accept", acceptJob);
router.put("/increase/:id", increaseFare);
router.put("/cancel/:id", cancelJob);
router.put("/complete/:id", completeJob);
router.post("/rate/:id", rateJob);

export default router;
