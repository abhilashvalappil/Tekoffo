export interface SingUpFormData {
    username: string;
    email: string;
    password?: string;
    role:UserRole
    // role:'client' | 'freelancer'| 'admin';

}
export enum UserRole {
    Client = 'client',
    Freelancer = 'freelancer',
    Admin = 'admin',
}

export interface Passwords {
    currentPassword:string;
    newPassword:string;
}