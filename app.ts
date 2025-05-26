import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

import { ErrorMiddleware } from './middleware/error';
import router from './routes/index';

export const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

// routes
app.use('/api/v1', router);

app.use(ErrorMiddleware);