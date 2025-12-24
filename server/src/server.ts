import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.router';
import adminRouter from './routes/admin.router';
import cookieParser from 'cookie-parser'
import morganMiddleware from './middlewares/morgan.middleware';
import { errorHandler } from './errors/errorHandler';
import http from "http";
import { initSocket } from './config/socket'; 
import { setupSocketEvents } from './utils/socketManager';

dotenv.config();

const app = express();
const mongoUrl = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;
  

app.use(cors({
  origin: CLIENT_URL?.split(","),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const server = http.createServer(app);
const io = initSocket(server);  
setupSocketEvents(io);

app.use(express.json({
  strict: true,
  type: ['application/json', 'application/*+json']
}));

app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(morganMiddleware);

app.use('/', userRouter);
app.use('/admin',adminRouter)

app.get("/", (req, res) => {
  res.send("Hello, TypeScript!");
});

 if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined in environment variables");
}
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(errorHandler);

export default app;