import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authroute.js";
import userRouter from "./routes/userRoute.js";


const app = express();
const port = process.env.PORT || 4000;
const FRONTEND=process.env.FRONTEND_URL

connectDB();

// ✅ Proper CORS setup
app.use(cors({
  origin: [  
    FRONTEND 
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is Working!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`✅ Server started on Port: ${port}`);
});
