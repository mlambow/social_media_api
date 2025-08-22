import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { username, email, password } = req.body;

        //checking if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        if (!salt) {
            const error = new Error("Failed to generate salt for password hashing");
            error.statusCode = 500;
        }
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const newUsers = await User.create([{
            username,
            email,
            password: hashedPassword,
        }], { session });

        //token
        const token = jwt.sign({ id: newUsers[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ 
            success: true, 
            message: "User created successfully", 
            data: {
                token,
                user: newUsers[0]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, password } = req.body;

        //checking if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        //Check password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        //token
        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ 
            success: true, 
            message: "User signed in successfully", 
            data: {
                token,
                user: existingUser
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        // In a real application, you might want to invalidate the token or perform other cleanup actions
        
        res.status(200).json({ 
            success: true, 
            message: "User signed out successfully" 
        });
    } catch (error) {
        next(error);
    }
}