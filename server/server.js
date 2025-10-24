import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authroute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(cors({
  origin: "https://authsystem-epkj.onrender.com",
  credentials: true,
}));
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is Working!");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`✅ Server started on Port: ${port}`);
});
