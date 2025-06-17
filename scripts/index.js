require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
//const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const app = express()
app.use(express.json())
PORT = process.env.PORT || 8000
mongoose.connect(process.env.MONGODB_URL)

.then(() => {
    console.log("MongoDB connected...")
    app.listen(PORT, () => {
        console.log(`Server started  running on ${PORT}`)
    })
})

// Generate Tokens

function generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user?.id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m"}

    );

    const refreshToken = jwt.sign(
        { userId: user?.id },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d"}
    );
    return { accessToken, refreshToken}
}

// Login

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email) {
            return res.status(400).json({message: "Email is required"})
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({message: "Invalid email"})
        }

        if(!password) {
            return res.status(400).json({messsage: "password is required"})
        }

        const existingUser = await User.findOne({ email })
        if(!existingUser) {
            return res.status(400).json({message: "User not found"})
        }

        const isPasswordValid = await bcrypt.compare(password, User?.password)
        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid password or email"})
        }

         const { accessToken, refreshToken} = generateTokens(existingUser)
         
         res.status(200).json({
            message: `Welcome back ${existingUser.firstName} ${existingUser.lastName}!`,
            accessToken,
            refreshToken
         })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
} 


 // Sign up

 const registerUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password, state, phoneNumber} = req.body
        
        // validation
        if(!firstName) {
            return res.status(400).json({message: "First name field is required"})
        }

        if(!lastName) {
            return res.status(400).json({message: "Last name field is requied"})
        }

        if(!email) {
            return res.status(400).json({message: "Email field is required"})
        }

         if(!validator.isEmail(email)) {
            return res.status(400).json({message: "Invalid email"})
        }

        if(!password) {
            return res.status(400).json({message: "password field is required"})
        }

        if(!state) {
            return res.status(400).json({message: "State field is required"})
        }

        if(!phoneNumber) {
            return res.status(400).json({message: "Phone number field is required"})
        }
        
        const userExists = await User.findOne({ email})
        if(userExists) {
            return res.status(400).json({message: "User already exists with that email"})
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await new User({
            firstName,
            lastname,
            email,
            password: hashedPassword,
            state,
            phoneNumber
        })
        await newUser.save()

    // Wallet for new user
    const wallet = await new Wallet({
        userId: newUser?.id
    })
    await wallet.save()

    res.status(201).json({
        message: "User created successfully",
        newUser: {
            firstName,
            lastName,
            email
        }
    })
 } catch (error) {
    return res.status(500).json({message: error.message})
 }
}
module.eports = {registerUser, logIn}