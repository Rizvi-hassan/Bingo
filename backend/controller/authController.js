const userModel = require("../models/userModel");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios')
const jwt = require('jsonwebtoken')

const googleLogin = async (req, res)=>{
    try {

        //recieves code from frontend and verifies its authenticity.
        const {code} = req.query;
        console.log("login initiate");
        const googleRes = await oauth2client.getToken(code); // extracts token from the code
        oauth2client.setCredentials(googleRes.tokens);  // verifies the token
        
        // console.log("access token: ", googleRes.tokens.access_token)
        
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )

        // after verification, google sends user info
        const {email, name, picture} = userRes.data;

        console.log('login: ',email, name);


        // saves the uesr details in the db
        let user = await userModel.findOne({email});
        if(!user){
            user = await userModel.create({name, email, image: picture})
        }

        const {_id} = user;
        const token = jwt.sign({_id, email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT
        });

        return res.status(200).json({
            message:'Success',
            token,
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        })
        console.log(error)
    }
}

module.exports = {
    googleLogin
}