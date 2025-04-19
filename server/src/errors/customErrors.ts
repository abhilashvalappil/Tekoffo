export class CustomError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'CustomError'
    }
}

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class ConflictError extends CustomError {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string){
        super(message);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}