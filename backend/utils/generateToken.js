import { config } from 'dotenv'
config();
import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    console.log(process.env.JWT_SECRET, process.env.JWT_EXPIRE)
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

    const expTime = parseInt(process.env.JWT_EXPIRE) * 24 * 60 * 60; // expire time in seconds 
    console.log(expTime);

    res.cookie('jwtToken', token, {
        maxAge: expTime,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'dev'
    })
}

export default generateToken