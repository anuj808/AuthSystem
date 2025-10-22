import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authroute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to database
connectDB();

// ✅ Updated frontend URL
app.use(cors({
  origin: ["https://authsystemfrontend-wt73.onrender.com"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API is Working !");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Server
app.listen(port, () => {
  console.log(`Server started on Port: ${port}`);
});
