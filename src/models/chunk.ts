import {Schema, model } from 'mongoose';
import mongoose from 'mongoose'

const chunkSchema = new Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Document', 
        required: true
    },
  
    text: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export default model('Chunk', chunkSchema);