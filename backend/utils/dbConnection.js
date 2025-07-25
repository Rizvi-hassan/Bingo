import { connect } from 'mongoose';

const DB_URL = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/bingoDB';

connect(DB_URL)
.then(()=>{
    console.log('db is connected');
})
.catch((err)=>{
    console.log('error connecting db: ', err)
})