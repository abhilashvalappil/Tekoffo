

export interface User {
    _id: string;
    username: string;
    email: string;
    role:UserRole
    isBlocked?: boolean;
    status?: string;
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

export interface AddCategoryPayload {
    // catId:string;
    name: string;
    subcategories: string[];
  }

  export interface EditCategoryPayload {
    _id:string;
    name: string;
    subcategories: string[];
  }

  export interface fetchedCategories {
    _id?:string;
    catId:string;
    name:string;
    subCategories:string[];
    isListed:boolean;
  }