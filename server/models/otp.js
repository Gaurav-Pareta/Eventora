const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique: true
    },
    action: {
        type: String,
        enum : ['account_verification', 'event_booking'],
        required : true
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires : 300 // Otp expires in 5 min
    }
})

module.exports = mongoose.model("OTP", otpSchema);