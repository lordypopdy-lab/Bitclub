const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    totalUser: Number,
    totalContractOne: Number,
    adminName: String,
    adminEmail: String,
    totalContractProfit: Number,
    contractOnePrice: Number,
    marketCap: Number,
    IncreasePercent: Number
})

const adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel;