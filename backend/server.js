import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// CORS Configuration
app.use(cors({
  origin: [
    "https://spicy-soul.vercel.app",
    "https://spicy-soul-admin.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: "GET,POST,PUT,DELETE",  // Allow the necessary HTTP methods
  credentials: true,  // Allow credentials (cookies, Authorization headers, etc.)
}));

// Middleware
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// DB connection
connectDB();

// Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
