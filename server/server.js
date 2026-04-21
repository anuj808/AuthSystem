import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from "./routes/authroute.js";
import userRouter from "./routes/userRoute.js";
import helperRoutes from "./routes/helperRoutes.js"; 
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is Working!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/helpers", helperRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);

app.listen(port, () => {
  console.log(`✅ Server started on Port: ${port}`);
});
