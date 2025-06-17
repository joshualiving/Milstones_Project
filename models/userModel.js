const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    ladstName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    state: {type: String, required: true},
    phoneNumber: {type: String, required: true}
    
    // Add more fields as needed
})

    const User = mongoose.model("User", UserSchema)
    module.exports = User


   