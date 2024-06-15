const mongoose = require('mongoose');
const { Schema } = mongoose;

const contractOneShema = new Schema({
    to: String,
    from: String,
    email: {
        type: String,
        unique: true
    },
    name: String,
    gasFee: String,
    status: String,
    contractPrice: Number,
    contractProfit: Number,
    cumulativeGasUsed: Number
})

const ContractOneModel = mongoose.model('UserContractOne', contractOneShema);

module.exports = ContractOneModel;