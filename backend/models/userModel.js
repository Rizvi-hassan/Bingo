import { Schema, model } from 'mongoose'

// stores user info in db -- not utilized this part in the project (just dummy)
const userSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        type: String
    },
    password: {
        type: String,
        select: false
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'social-logins'
    }],
    authType: {
        type: String,
        enum: ['google', 'local'],
        default: 'local'
    },
}, 
{
    timestamps: true
})

const userModel = model('social-logins', userSchema)

export default userModel