import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app =express();
const server =http.createServer(app)

// socket io server
const io = new Server(server, {
    cors:{
        origin:['http://localhost:5173']
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

//used to store online USers 
const userSocketMap = {};

//socket-> new user // when is thee any connection is there then this will print
io.on("connection",(socket)=>{
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    // if (userId) userSocketMap[userId] = socket.id;: If userId exists, it maps the userId to the socket.id in the userSocketMap object.
    if(userId) userSocketMap[userId] = socket.id;

    //io.emit is used to send events to all connected clients 

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("A user disconnected" , socket.id)

        // delete userSocketMap[userId];: Removes the disconnected user's userId from the userSocketMap.
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {io, server, app};