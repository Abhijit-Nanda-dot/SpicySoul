import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Load environment variables
dotenv.config();

// App configuration
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "https://spicy-soul-admin.vercel.app",
    "https://spicy-soul.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  withCredentials: true
}));

// Debug middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to the database
connectDB();

// Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Catch-all for undefined routes
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: [
      "GET /",
      "GET /api/user/test",
      "POST /api/user/register",
      "POST /api/user/login"
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
