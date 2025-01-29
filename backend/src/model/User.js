const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true, minlength:6
    },
    profilePic : {
        type: String, default: ""
    },
    lastLogin: {
        type: Date, default: Date.now
    },
    isVerified: {
        type: Boolean, default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},{timestamps:true,strict:true,minimize:true});

const User = mongoose.model('User', userSchema);

module.exports = User;