const Message = require('../model/Message');
const User = require('../model/User');
const cloudinary = require("../utils/cloudinary.js");
const { getReceiverSocketId, io } = require('../utils/socket.js');

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedinId = req.userId;
        const filteredUsers = await User.find({ _id: { $ne: loggedinId } }).select("-password");
        res.status(200).json({success: true, message: "users fetched successfully", filteredUsers});
    } catch(e){
        res.status(500).json({success: false, message: "Error fetching users"});
    }
}

const getMessages = async (req,res)=> {
    const {id : userToChatId} = req.params;
    const myId = req.userId;
    try {
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json({success:true, message: "messages fetched successfully", messages});
    } catch(e){
        res.status(500).json({success: false, message: "Error fetching messages"});
    }
}

const sendMessage = async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    let imageURL;
    if(image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageURL = uploadResponse.secret_url;
    }
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image : imageURL
    })

    await newMessage.save();

    // socket.io functions here
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({success: true, message: "message sent successfully", newMessage});
}

module.exports = { getUsersForSidebar, getMessages, sendMessage };