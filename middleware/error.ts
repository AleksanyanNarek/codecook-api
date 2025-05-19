import { Request, Response, NextFunction } from 'express';
import { CustomErrorStructure } from "../utils/types";

export interface CustomError extends Error, CustomErrorStructure {}

export const ErrorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    // //wrong jwt error
    // if (err.name === 'JsonWebTokenError') {
    //     const message = 'Json web token is invalid, try again';
    //     err = new ErrorHandler(message, 400);
    // }

    // //JWT expired error
    // if (err.name === 'TokenExpiredError') {
    //     const message = 'Json web token is expired, try again';
    //     err = new ErrorHandler(message, 400);
    // }

    res.status(err.statusCode || 500).json({
        success: false,
        errorDetails: err.errorDetails,
        message: err.message || "Internal server error",
    })
}