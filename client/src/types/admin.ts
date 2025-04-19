

export interface User {
    _id: string;
    username: string;
    email: string;
    role:UserRole
    isBlocked: boolean;

}

export enum UserRole {
    Client = 'client',
    Freelancer = 'freelancer',
    Admin = 'admin',
}

export interface FetchUserResponse {
    users: User[];
    totalCount: number;
  }

export interface Category {
    catId:string;
    name: string;
    subcategories?: string[];
  }

  export interface fetchedCategories {
    _id?:string;
    catId:string;
    name:string;
    subCategories:string[];
    isListed:boolean;
  }