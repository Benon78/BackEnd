/** @format */
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

//Authentication middleware
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
   return res.status(401).json({
      success: false,
      message: "Access denied. Your session expired! Please login to continue",
    });
  }

 // decoding the token
 try {
 const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);

 req.userInfo = decodedToken;
 next();
    
 } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Access denied. Your session expired! Please login to continue",
      });
 }
};


// Admin Authentication middleware
export const adminAuthMiddleware = (req,res,next)=>{
    if(req.userInfo.role !== 'admin'){
       return  res.status(403).json({
            success: false,
            message: 'Access dined! Admin required'
        })
    }

    next();
}
























