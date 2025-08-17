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
    origin: ['http://localhost:5173', process.env.CORS_ORIGIN],
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