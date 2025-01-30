const Message = require('../model/Message');
const User = require('../model/User');
const cloudinary = require("../utils/cloudinary.js");
const { getReceiverSocketId, io, userSocketMap } = require('../utils/socket.js');

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedinId = req.userId;
        let users = await User.find({ _id: { $ne: loggedinId } }).select("-password");

        // Get online users (assuming you have some mechanism to track online users)
        const onlineUsers = Object.keys(userSocketMap); // This function should return an array of online user IDs

        // Get last message time for sorting
        const usersWithLastMessage = await Promise.all(users.map(async (user) => {
            const lastMessage = await Message.findOne({
                $or: [
                    {senderId: loggedinId, receiverId: user._id},
                    {senderId: user._id, receiverId: loggedinId}
                ]
            }).sort({ createdAt: -1 });

            return {
                ...user.toObject(),
                lastMessageTime: lastMessage ? lastMessage.createdAt : null,
                online: onlineUsers.includes(user._id.toString())
            };
        }));

        // Sort by online status first, then by last message time
        usersWithLastMessage.sort((a, b) => {
            if (a.online === b.online) {
                return b.lastMessageTime - a.lastMessageTime; // Sort descending by last message time
            }
            return a.online ? -1 : 1; // Online users come first
        });

        res.status(200).json({success: true, message: "users fetched successfully", filteredUsers: usersWithLastMessage});
    } catch(e){
        res.status(500).json({success: false, message: "Error fetching users"});
    }
};

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
    if (image) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
            if (!imageURL) {
                throw new Error('Image URL not found in upload response');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ success: false, message: 'Error uploading image' });
        }
    }

    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL
        });

        await newMessage.save();

        // socket.io functions here
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, message: "message sent successfully", newMessage });
    } catch (e) {
        console.error('Error sending message:', e);
        res.status(500).json({ success: false, message: "Error sending message" });
    }
};


module.exports = { getUsersForSidebar, getMessages, sendMessage };