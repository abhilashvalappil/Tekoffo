import { Response } from "express";
import { Http_Status } from "../constants/statusCodes";
import {ConflictError, ValidationError, CustomError,NotFoundError,UnauthorizedError } from "../utils/customErrors";
import {MESSAGES} from '../constants/messages'

export class ErrorHandler {
    static handleError(error:any, res:Response): void {
        let statusCode = Http_Status.INTERNAL_SERVER_ERROR;
        let message = MESSAGES.SERVER_ERROR;

        if(error instanceof ValidationError){
            statusCode = Http_Status.BAD_REQUEST
            message = error.message
        }else if(error instanceof ConflictError){
            statusCode = Http_Status.CONFLICT
            message = error.message
        }else if (error instanceof NotFoundError) {
            statusCode = Http_Status.NOT_FOUND;  
            message = error.message;
        }else if (error instanceof UnauthorizedError) {
            statusCode = Http_Status.UNAUTHORIZED;  
            message = error.message;
        }else if(error instanceof CustomError){
            statusCode = Http_Status.INTERNAL_SERVER_ERROR
            message = error.message
        }else {
            console.error('Unhandled error:', error);
        }
        res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
}