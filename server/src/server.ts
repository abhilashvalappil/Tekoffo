import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.router';
import { OAuth2Client } from 'google-auth-library';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use('/', userRouter);

mongoose
  .connect("mongodb://localhost:27017/Tekoffo" )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello, TypeScript!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

export default app;