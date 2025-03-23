const mongoose = require('mongoose')

// stores user info in db -- not utilized this part in the project (just dummy)
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