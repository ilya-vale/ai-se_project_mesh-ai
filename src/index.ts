import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from "./routes/index.js";
import mongoose from 'mongoose';
import { logger } from './middleware/logger.js';
import {errorHandler, notFoundHandler} from './middleware/error.js'

const app = express();


app.use(logger)
app.use(express.json());
app.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/test-error', (req, res) => {
  throw new Error('Test error');
});

app.get("/health", (req, res): void => {
    const now = new Date();
    console.log(now);
    // console.log(new Date().getTime());
    res.status(200).json(
        {
            "success": "true",
            "data": {"status": "ok"},
            "error": null
        }
    );
});

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI!)
.then(()=> {
    app.listen(port, () => {
        console.log('MongoDB connected');
        console.log(`Server running on port ${port}`);
        console.log(process.env.MONGO_URI, process.env.NEBIUS_API_KEY);
    })
}) 
.catch((err) => {
    console.error('Connection error', err)
})
