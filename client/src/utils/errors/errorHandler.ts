
// import { ApiError } from "./errors";
 

// export const handleApiError = (error:unknown): string => {
//     if (error instanceof ApiError) {
//       return error.message || 'An error occurred';
//     } else if (error instanceof Error) {
//       return error.message;
//     } else {
//       return 'An unknown error occurred,errorhandler';
//     }
//   };

// utils/handleApiError.ts

import { AxiosError } from "axios";

interface BackendErrorResponse {
    success: boolean;
    message: string;
    error?: string;
}

export const handleApiError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const backendError = error.response?.data as BackendErrorResponse;
        return backendError?.message || "Something went wrong. Please try again.";
    } else if (error instanceof Error) {
        return error.message;
    } else {
        return "An unexpected error occurred.";
    }
}
