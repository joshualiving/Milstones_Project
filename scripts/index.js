const express = require("express");
const app = express();
require("dotenv").config();
// Body Parser Middleware
app.use(express.json());
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("MONGODB connected successfully...")
    app.listen(PORT, () => {
        console.log(`Server started running on ${PORT}`)
    })
})





