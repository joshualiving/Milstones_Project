const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    walletRef: {type: mongoose.Types.ObjectId, ref: "Wallet"}
}, {timestamps: true})
// Add more fields as needed

const User = mongoose.model("User", userSchema) 