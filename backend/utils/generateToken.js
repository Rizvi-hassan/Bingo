import { config } from 'dotenv'
config();
import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

    const expTime = parseInt(process.env.JWT_EXPIRE) * 24 * 60 * 60 * 1000; // expire time in milliseconds 

    res.cookie('jwtToken', token, {
        maxAge: expTime,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'dev',
        sameSite: none,
    })
}

export default generateToken