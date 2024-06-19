const mongoose = require('mongoose');
const {Schema} = mongoose;

const transactionSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    amount: Number,
    to: String,
    from: String,
    blockNumber: String,
    transactionHash: String,
    status: String
})