const mongoose = require('mongoose')

const DB_URL = process.env.MONGO_DB_URI;

mongoose.connect(DB_URL)
.then(()=>{
    console.log('db is connected');
})
.catch((err)=>{
    console.log('error connecting db: ', err)
})