const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;