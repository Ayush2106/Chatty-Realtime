import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
export const signupController =  async(req,res)=>{
    const {fullName, email, password} = req.body;
    try {

    if(!fullName || !email || !password){
        return res.status(400).json({message: "All Fields are required"})
     }
     if(password.length <6){
        return res.status(400).json({message: "Password must be atleast 6 charcter long"})
     }

     const user = await User.findOne({email})
     if(user){
        return res.status(400).json({message: "Email Already exists"})
     }

     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt);
     
     //create user in database
     const newUser = new User({
        fullName,
        email,
        password: hashedPassword
     })

     if(newUser) {
        //generate jwt token
        generateToken(newUser._id , res)
        await newUser.save();
        
        //respond to client 
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })
     }else{
        res.status(400).json({message: 'Invalid user data'})
     }

    }catch(error){
    console.log("Error in signup controller" , error.message)
    res.status(500).json({message:"Internal Server Error"})
    }
}

export const loginController =  async(req,res)=>{
    try{
    const {email, password} = req.body;

    const existingUser = await User.findOne({email})
      
    if(!existingUser){
        return res.status(401).json({message: "Invalid Credentials"}) // not user know exact reason
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(401).json({message: "Invalid Credentials"}) // not user know exact reason
    }

    generateToken(existingUser._id, res);
    res.status(200).json({
        _id:existingUser._id,
        fullName:existingUser.fullName,
        email:existingUser.email,
        profilePic:existingUser.profilePic,
    })

    }catch(error){
    console.log("Error in login controller" , error.message)
    res.status(500).json({message:"Internal Server Error"})    }
}

export const logoutController =  async(req,res)=>{
    try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:'Logged out successfully'})
    }catch(error){
        console.log("Error in logout controller" , error.message)
        res.status(500).json({message:"Internal Server Error"})    }
}

export const updateProfileController = async(req,res)=>{
    try{
    const {profilePic}  = req.body;
    // as it is protect midddlware and thats why u have user in req body 
    const userId = req.user._id;

    if(!profilePic){
        return res.status(400).json({message:'Profile pic is required'})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    // uploadResponse: Contains the response from Cloudinary, including the URL of the uploaded image (secure_url).


    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url} , {new:true})
    // User.findByIdAndUpdate: Updates the user's profilePic field in the database with the new image URL.


    res.status(200).json(updatedUser);
    }catch(error){
        console.log("Error in updating profile controller" , error.message)
        res.status(500).json({message:"Internal Server Error"})   
     }
}

export const checkAuthController = async(req,res)=>{
    try{
      // just send the user to client 
      res.status(200).json(req.user)
    }catch(error){
        console.log("Error in check auth  controller" , error.message)
        res.status(500).json({message:"Internal Server Error"})   
     }
}