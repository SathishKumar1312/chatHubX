const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);

const io = new Server( server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

// used to store online users
const userSocketMap = {}; // {userId : socketId}

const getReceiverSocketId = (receiverId)=>{
    return userSocketMap[receiverId]
}

io.on('connection',(socket)=>{
    console.log("A user has connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

module.exports = {app, server, io, getReceiverSocketId}