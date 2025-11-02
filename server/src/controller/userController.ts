import { Request, Response } from "express"
import User from "../models/User";
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/jwt";
import cloudinary from "../utils/cloudinary";


//SIgnup a new User
export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, bio } = req.body;
        if (!fullName || !email || !password || !bio) {
            return res.json({ message: "Missing Details" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })
        const token = generateToken(String(newUser._id));

        res.status(201).json({
            success: true,
            userData: newUser,
            token,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ message: "Server error." });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter the email and the password." });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        const token = generateToken(String(userData._id));
        return res.status(200).json({
            success: true,
            userData,
            token,
            message: 'Login successful.'
        })
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ message: "Server error" })
    }
}

//to check wheather the user is authenticated
export const checkAuth = (req: Request, res: Response) => {
    res.json({ success: true, user: req.user })
}

//function to update the user profile detauls
export const updateProfile = async (req: Request, res: Response) => {
    try {

        const { profilePic, bio, fullName } = req.body;
        const userId = req.user?._id;
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }
        res.json({ success: true, user: updatedUser })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}