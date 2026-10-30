import {Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const messageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chat', 
        required: true
    },
  
    content: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default model('Message', messageSchema);