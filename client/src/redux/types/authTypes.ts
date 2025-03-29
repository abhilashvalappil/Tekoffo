export interface User {
    username: string;
    email: string;
    password: string;
    role:'client' | 'freelancer';
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated:boolean;
    successMessage: string | null;
}

export interface SignInCredentials {
    identifier: string;
    password: string;
}

export interface GoogleSignUpCredentials {
    credential: string;
}