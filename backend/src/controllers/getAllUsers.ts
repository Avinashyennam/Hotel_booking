import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwt_key: string = process.env.JWT_KEY as string;
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        if(users.length == 0){
            res.status(400).json({message: "no users are existing"});
            return;
        }
        res.status(200).json(users);
        return;
    } catch (error) {
        console.log("Error fetching users ", error);
        res.status(500).json({message: "interval server error"});
    }
}
// route for user signup
export const userSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ message: "all fields are required" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, jwt_key, {
            expiresIn: "1h"
        });
        res.status(201).json({
            message: "Signup successful",
            user: { id: savedUser._id, email: savedUser.email, firstName: savedUser.firstName, lastName: savedUser.lastName },
            token
        });
        return;
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// route for user login
export const userLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "all fields are required" });
        return;
    }
    const user = await User.findOne({ email });
    if (user == null) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }
    const token = jwt.sign({ id: user._id, email: user.email }, jwt_key, {
        expiresIn: "1h"
    });
    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
    return;
}

// route for delete my account
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (user == null) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "account deleted succesfully" });
        return;
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }

}

// route for updating user details
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { firstName, lastName, password } = req.body;
        const user = await User.findById(id);
        if (user == null) {
            res.status(404).json({ message: "user not found" });
            return;
        }

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        const updatedUser = await user.save();
        res.status(200).json({
            message: "User record updated successfully",
            updatedUser
        });
        return;

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Server error"});
        return;
    }
}

export const getuserId = (req: Request, res: Response) => {
    const id: String = req.params.id;
    res.status(500).send(`Bad request ${id}`);
}