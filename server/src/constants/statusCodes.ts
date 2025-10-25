export enum Http_Status {
    OK = 200,              // General success (e.g., GET requests)
    CREATED = 201,         // Resource created (e.g., POST signup)
    NO_CONTENT = 204,      // Successful action with no data to return (e.g., DELETE /users/123)
    BAD_REQUEST = 400,     // Invalid request data (e.g., missing fields)
    UNAUTHORIZED = 401,    // Authentication failed (e.g., wrong password)
    FORBIDDEN = 403,       // Client lacks permission (e.g., non-admin access)
    NOT_FOUND = 404,       // Resource doesn’t exist (e.g., user ID not found)
    CONFLICT = 409,        // Duplicate resource (e.g., email already exists)
    INTERNAL_SERVER_ERROR = 500, // Server-side error (e.g., database failure)
  }