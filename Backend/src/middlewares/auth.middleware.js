import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async(req, res, next)=>{
try{
const token = req.cookies.jwt; // from utils

if(!token){
return res.status(401).json({message: "Unauthorized - NO token found"})
}

const decoded = jwt.verify(token, process.env.JWT_SECRET)
if(!decoded){
return res.status(401).json({message: "Unauthorized - NO token found"})
}

const user = await User.findById(decoded.userId).select("-password");

if(!user){
return res.status(401).json({message: "User not found"})
}

// now user is authneticated
req.user = user
next()
}catch(error){
    console.log("Error in protetced  middleware " , error.message)
    res.status(500).json({message:"Internal Server Error"})
}
}
