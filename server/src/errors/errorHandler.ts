import { Request, Response, NextFunction } from "express";
import { Http_Status } from "../constants/statusCodes";
import {ConflictError, ValidationError, CustomError,NotFoundError,UnauthorizedError } from "./customErrors";
import {MESSAGES} from '../constants/messages'

 
    export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
        let statusCode = Http_Status.INTERNAL_SERVER_ERROR;
        let message = MESSAGES.SERVER_ERROR;
    
        switch (true) {
            case error instanceof ValidationError:
              statusCode = Http_Status.BAD_REQUEST;
              message = error.message;
              break;
        
            case error instanceof ConflictError:
              statusCode = Http_Status.CONFLICT;
              message = error.message;
              break;
        
            case error instanceof NotFoundError:
              statusCode = Http_Status.NOT_FOUND;
              message = error.message;
              break;
        
            case error instanceof UnauthorizedError:
              statusCode = Http_Status.UNAUTHORIZED;
              message = error.message;
              break;
        
            case error instanceof CustomError:
              statusCode = Http_Status.INTERNAL_SERVER_ERROR;
              message = error.message;
              break;
        
            default:
              console.error("Unhandled error:", error);
              break;
          }
    
        res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    };