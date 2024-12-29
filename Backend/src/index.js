import express from "express"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from 'dotenv'
import cors from 'cors'

import path from "path"
import cookieParser from 'cookie-parser'
import { connectDB } from "./lib/db.js";
import {app, server} from './lib/socket.js'

dotenv.config()
const PORT = process.env.PORT;
const __dirName = path.resolve();


app.use(express.json())
app.use(cookieParser())
app.use(cors({
 origin:'http://localhost:5173',
 credentials: true,
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirName, "../Frontend/dist")))

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirName, "..Frontend", "dist", "index.html"))
    })
}

// instead app.listen i have made socket io server on top of it
server.listen( PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB()
})