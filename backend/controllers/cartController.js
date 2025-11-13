import userModel from "../models/userModel.js"

const addToCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        if(!userData){
            return res.json({success:false,message:"User not found"})
        }
        let cartData = userData.cartData || {};
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Added to cart"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const removeFromCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        if(!userData){
            return res.json({success:false,message:"User not found"})
        }
        let cartData = userData.cartData || {};
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
            // If quantity reaches 0, remove the item completely from cart
            if(cartData[req.body.itemId] <= 0){
                delete cartData[req.body.itemId];
            }
        } else {
            // Item doesn't exist in cart
            return res.json({success:false,message:"Item not in cart"})
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed from cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const removeAllFromCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        if(!userData){
            return res.json({success:false,message:"User not found"})
        }
        let cartData = userData.cartData || {};
        if(cartData[req.body.itemId]){
            // Remove the entire item from cart
            delete cartData[req.body.itemId];
            await userModel.findByIdAndUpdate(req.body.userId,{cartData});
            res.json({success:true,message:"Item removed from cart"})
        } else {
            return res.json({success:false,message:"Item not in cart"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const getCart = async(req,res) =>{
    try {
        console.log("getCart - userId:", req.body.userId);
        if(!req.body.userId){
            return res.json({success:false,message:"User ID not found. Please login again."})
        }
        let userData = await userModel.findById(req.body.userId);
        if(!userData){
            return res.json({success:false,message:"User not found"})
        }
        let cartData = userData.cartData || {};
        res.json({success:true,cartData})
    } catch (error) {
        console.error("getCart error:", error);
        res.json({success:false,message:error.message || "Error fetching cart"})
    }
}

export {addToCart,removeFromCart,removeAllFromCart,getCart}