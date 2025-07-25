import User from './../models/userModel.js'
import jwt from 'jsonwebtoken'
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorised" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" })
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protect middleware: ", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default protect
