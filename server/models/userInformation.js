const mongoose = require('mongoose');
const { Schema } = mongoose;

const userInfoSchema = new Schema({
    email: String,
    Id: String,
    Country: String,
})

const userInfomationModel = mongoose.model('userInformation', userInfoSchema);

module.exports = userInfomationModel;