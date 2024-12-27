import { comparePassword, hashPassword } from '../helpers/authHelper.js'; // Corrected typo
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validation
        if (!name) {
            return res.status(400).send({ error: "Name is required" });
        }
        if (!email) {
            return res.status(400).send({ error: "Email is required" });
        }
        if (!password) {
            return res.status(400).send({ error: "Password is required" });
        }
        if (!phone) {
            return res.status(400).send({ error: "Phone is required" });
        }
        if (!address) {
            return res.status(400).send({ error: "Address is required" });
        }

        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: 'Already registered, please login',
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Save user
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save();

        // Send response
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Error in registration",
            error,
        });
    }
};

// Login Controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password); // Corrected typo
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // Generate token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "786871d",
        });

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error("Error in loginController:", error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

//test controller
export const testController=(req,res)=>{
    res.send("protected routes")
}

  
