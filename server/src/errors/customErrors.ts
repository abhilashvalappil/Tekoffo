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

export class ConflictError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
        console.log('console not Conflict error with message : ',message)
    }
}

export class NotFoundError extends ConflictError {
    constructor(message: string){
        super(message);
        this.name = 'NotFoundError';
        console.log('console not found error with message : ',message)

    }
}

export class UnauthorizedError extends NotFoundError {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
        console.log('console UnauthorizedError error with message :',message)
    }
}