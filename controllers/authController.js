const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Wallet = require("../models/wallet");
const validator = require("validator");
require("dotenv").config();

// Login 
function generateToken(user) {
    const accessToken = jwt.sign(
        { userId: user._id},
        process.env.ACCESS_TOKEN,
        { expiresIn: "15"}
    );

    const refreshToken = jwt.sign(
        { userId: user._id},
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d"}
    );

    return { accessToken, refreshToken };
}

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if(!firstName) {
            return resizeBy.status(400).json({ message: "First name is requied"})
        };
        if(!lastName) {
            return res.status(400).json({message: "Last name is required"})
        };
        if(!email) {
            return res.status(400).json({ message: "Email is required"})
        };
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        };
        if(!password) {
            return res.statuis(400).json({ message: "Password is required"})
        };
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
            return res.status(400).json({ message: "Password is not strong enough" });
        };

        // Existing User Check With Email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with that email"})
        };

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        await newUser.save();

        // Create Wallet for User
        const wallet = new Wallet({
            userId: newUser._id
        })
        await wallet.save();
        res.status(201).json({
            message: "User registered successfully",
            newUser: { firstName: firstName,
                lastName: lastName,
                email: email
            }
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error"})
    } 
}

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if(!email) {
            return res.status(400).json({message: "Email is required"})
        };
        if(!validator.isEmail(email)) {
            return res.status(400).json({message: "Invalid email format"})
        };
        if(!password) {
            return res.status(400).json({message: "Password is required"})
        };

        const existingUser = await User.findOne({ email })
        if(!existingUser) {
            return res.status(400).json({message: "User does not exist with that email"})
        };
        const validPassword = await bcrypt.compare(password, existingUser.password)
        if(!validPassword) {
            return res.status(400).json({message: "Incorrect password or Email"})
        };

        // Sign a jwt
        const { accessToken, refreshToken } = generateToken(existingUser)

    } catch(error) {
        console.error(error)
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = { registerUser, loginUser}