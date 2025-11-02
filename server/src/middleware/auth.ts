import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/User";
import { verifyToken } from "../utils/jwt";


//Middleware to protect route
export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Unauthorized - No token provided" })
            return;
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

        if (!token) {
            res.status(401).json({ message: "Unauthorized - Invalid token format" })
            return;
        }

        const decoded = verifyToken(token);

        const user = await User.findById(decoded.userId)
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
}



