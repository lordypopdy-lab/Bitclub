const mongoose = require('mongoose');
const {Schema} = mongoose;

const notificationSchema = new Schema({
    email:{
        type: String
    },
    message: String
})

const notificationModel = mongoose.model("NotificationModel", notificationSchema);

module.exports = notificationModel;