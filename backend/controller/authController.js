import userModel from "../models/userModel.js";
import { oauth2client } from "../utils/googleConfig.js";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from './../models/userModel.js'
import encrypt from './../utils/encryptPwd.js'
import generateToken from "../utils/generateToken.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

export const googleLogin = async (req, res) => {
    try {

        //recieves code from frontend and verifies its authenticity.
        const { code } = req.query;
        console.log("login initiate");
        const googleRes = await oauth2client.getToken(code); // extracts token from the code
        oauth2client.setCredentials(googleRes.tokens);  // verifies the token

        // console.log("access token: ", googleRes.tokens.access_token)

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )

        // after verification, google sends user info
        const { email, name, picture } = userRes.data;

        console.log('login: ', email, name);


        // saves the uesr details in the db
        let user = await userModel.findOne({ email });
        if (!user) {
            user = await userModel.create({ name, email, image: picture })
        }

        const { _id } = user;
        const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT
        });

        return res.status(200).json({
            message: 'Success',
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

export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body

        if (email.trim() === '' || username.trim() === '' || password.trim() === '' || !req.file) {
            return res.status(401).json({ message: "All fields are required" })
        }

        const sameEmail = await User.findOne({ email: email });
        if (sameEmail) {
            return res.status(409).json({ message: "User with same email already exists" })
        }

        const sameName = await User.findOne({ username: username });
        if (sameName) {
            return res.status(409).json({ message: "User with same username already exists" })
        }

        const newUser = await User.create({
            email,
            username,
            profile: req.file.path,
            password: await encrypt(password)
        })

        await newUser.save()

        generateToken(res, newUser._id);

        return res.status(200).json({
            success: true,
            user: {
                email,
                username,
                profile: req.file.path
            }
        })

    } catch (error) {
        console.log(error);
        if (req.file) {
            console.log("Deleting profile");
            await deleteFromCloudinary(req.file.path);
        }

        return res.status(500).json({ message: "Internal Server Error", error });
    }

}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (email.trim() === '' || password.trim() === '' ) {
            return res.status(401).json({message: "All fields are required"});
        }

        const foundUser = await User.findOne({email: email}).select("+password");
        if (!foundUser) {
            res.status(404).json({message: "No user with this email exists"});
        }
        
        const isPwdValid = await bcrypt.compare(password, foundUser.password);
        if (!isPwdValid) {
            res.status(401).json({message: "Invalid Credentials"})
        }

        generateToken(res, foundUser);
        res.status(200).json({
            success: true,
            user: {
                email: foundUser.email,
                username: foundUser.username,
                profile: foundUser.profile

            }
        })

    } catch (error) {
        console.log("Error in login: ", error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const {user} = req;
        res.status(200).json({
            user: {
                email: user.email,
                username: user.username,
                profile: user.profile
            }
        })
    } catch (error) {
        
    }
}

