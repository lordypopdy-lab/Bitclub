const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});

const contract1 = new Schema({
    price: Number,
    balance: Number
})

// const contract1Model = mongoose.model("contracts", contract1);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel