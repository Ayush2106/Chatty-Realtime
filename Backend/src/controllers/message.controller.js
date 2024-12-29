import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserforSidebarController = async(req, res)=>{
    try{
    //instead loggged in uswr i want other user 
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

    res.status(200).json(filteredUsers)
    }catch(error){
        console.log("Error is getUserSidebar controller" , error)
        res.status(500).json({error: "Internal server error"})
    }
}

export const getMessagesController = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;


        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesController", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const sendMessageController = async(req, res) =>{
    try{
     const {text, image} = req.body;
     const {id:receiverId} = req.params;
     const senderId = req.user._id

     let imageUrl;
     if(image){
        //upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url;
     }
     
     const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl,
     })

     await newMessage.save();

     const receiverSocketId = getReceiverSocketId(receiverId);
     if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
     }

     res.status(201).json(newMessage)
    }catch(error){
        console.log("error in sendmessagecontroller", error)
        res.status(500).json({error: 'Internal Server error'})
    }
}