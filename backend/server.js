import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import 'dotenv/config'
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

import dotenv from "dotenv";
dotenv.config();
//app config here
const app = express()
const port = 4000 || process.env.PORT ;


app.use(express.json())
const cors = require('cors');

app.use(cors({
  origin: [
    "https://spicy-soul-admin.vercel.app/",
    "https://spicy-soul.vercel.app/",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  withCredentials: true
}));
app.use(express.urlencoded({ extended: true }

// Debug middleware to log all incoming requests (before routes)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

//db here 
connectDB();


//APIS
app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

// Debug: Log all registered routes
console.log("=== Server Routes Registered ===")
console.log("  GET  /api/user/test")
console.log("  POST /api/user/register")
console.log("  POST /api/user/login")
console.log("  POST /api/cart/add")
console.log("  POST /api/cart/remove")
console.log("  POST /api/cart/remove-all")
console.log("  POST /api/cart/get")
console.log("================================")


app.get("/", (req,res)=>{
    res.send("API is working")
})

// Catch-all for undefined routes
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.url}`)
    res.status(404).json({ 
        success: false, 
        message: `Route not found: ${req.method} ${req.url}`,
        availableRoutes: [
            "GET /",
            "GET /api/user/test",
            "POST /api/user/register",
            "POST /api/user/login"
        ]
    })
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})
//mongodb+srv://SpicySoul:<db_password>@cluster0.a3xi706.mongodb.net/?