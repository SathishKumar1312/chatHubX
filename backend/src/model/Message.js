const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId, ref: User, required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId, ref: User, required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    }
},{timestamps:true,strict:true,minimize:true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;