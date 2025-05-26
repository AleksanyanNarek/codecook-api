import { CustomErrorStructure, ErrorDetails } from "./types";

class ErrorHandler extends Error {
    statusCode: number;
    errorDetails: ErrorDetails;

    constructor({
        statusCode,
        message,
        errorDetails,
    }: CustomErrorStructure) {
        super(message);

        this.statusCode = statusCode;
        this.errorDetails = errorDetails || {};

        Error.captureStackTrace(this, this.constructor);
    }

    static UnauthorizedError() {
        return new ErrorHandler({
            statusCode: 401,
            message: 'User unauthorized',
        })
    }
}

export default ErrorHandler;
