const express = require('express')
// const app = express();
require('dotenv').config()
require('./models/dbConnection');
const authRouter = require('./routes/authRouter')
const { app, server } = require("./lib/socket");
const cors = require('cors');
const port = process.env.PORT ||8080

app.use(cors());

app.get('/', (req, res)=>{
    res.send("Hello from auth server")
})

app.use('/auth', authRouter)

server.listen(port, ()=>{
    console.log(`Test app running on port: ${8080}`)
})