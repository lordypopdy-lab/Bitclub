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
    gasFee: Number,
    status: String,
    contractPrice: Number,
    contractProfit: Number,
    cumulativeGasUsed: Number,
    blockNumber : Number,
    blockHash : String,
    transactionHash: String
})

const ContractOneModel = mongoose.model('UserContractOne', contractOneShema);

module.exports = ContractOneModel;