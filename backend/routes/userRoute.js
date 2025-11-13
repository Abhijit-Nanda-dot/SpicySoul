import express from "express"
import { loginUser,registerUser } from "../controllers/UserController.js"

const userRouter = express.Router()

userRouter.get("/test", (req, res) => {
    res.json({ success: true, message: "User routes are loaded" })
})

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

export default userRouter;