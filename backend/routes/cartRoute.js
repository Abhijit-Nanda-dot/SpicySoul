import express from "express"
import { addToCart,removeFromCart,removeAllFromCart,getCart } from "../controllers/cartController.js"
import authMilddleware from "../middleware/auth.js";

const cartRouter=express.Router();

cartRouter.post("/add",authMilddleware,addToCart)
cartRouter.post("/remove",authMilddleware,removeFromCart)
cartRouter.post("/remove-all",authMilddleware,removeAllFromCart)
cartRouter.post("/get",authMilddleware,getCart)

export default cartRouter;