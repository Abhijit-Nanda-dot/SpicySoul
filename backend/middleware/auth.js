import jwt from "jsonwebtoken"
const authMilddleware = async (req,res,next)=>{  
    const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
    
    if(!token){
        return res.json({success:false,message:"Not Authorized Login Again"})
    }
    
    if(!process.env.JWT_SECRET){
        console.error("JWT_SECRET is not set in environment variables");
        return res.json({success:false,message:"Server configuration error"})
    }
    
    try{
        const token_decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!token_decode || !token_decode.id){
            return res.json({success:false,message:"Invalid token format"})
        }
        // Initialize req.body if it doesn't exist
        if(!req.body){
            req.body = {};
        }
        req.body.userId=token_decode.id;
        next();
    }catch(error){
        console.error("Auth middleware error:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        if(error.name === 'TokenExpiredError'){
            return res.json({success:false,message:"Token expired. Please login again."})
        }
        if(error.name === 'JsonWebTokenError'){
            return res.json({success:false,message:"Invalid token. Please login again."})
        }
        return res.json({success:false,message:`Authentication error: ${error.message || error.name}`})
    }
}
export default authMilddleware;