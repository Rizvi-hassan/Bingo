const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email: {
        type: String
    },
    image:{
        type: String 
    }
})

const userModel = mongoose.model('social-logins', userSchema)

module.exports = userModel