import CookieParser from 'cookie-parser'
import {config} from 'dotenv'
config()
import './utils/dbConnection.js';
import authRouter from './routes/authRouter.js';
import { app, server } from "./lib/socket.js";
import cors from 'cors';
import  express  from 'express';
const port = process.env.PORT ||8080

app.use(cors({
    origin: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'],
    credentials: true
}));

app.use(CookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    res.send("Hello from auth server")
})

app.use('/auth', authRouter)

server.listen(port, ()=>{
    console.log(`Test app running on port: ${8080}`)
})