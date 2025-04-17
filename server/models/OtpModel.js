const mongoose = require("mongoose");
const { Schema } = mongoose;

const verificationSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    Otp: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: ""
    },
    kycStatus: {
        type: String,
        default: ""
    },
    kycPic: {
        type: String,
        default: ""
    }
});

const OtpModel = mongoose.model("otp", verificationSchema);
module.exports = OtpModel;