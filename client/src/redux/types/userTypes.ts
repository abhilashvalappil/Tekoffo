export interface User {
    _id: string;
    username:string;
    email: string;
    role:string;
    isBlocked?: boolean;
  }


export interface UserState {
    users: User[] | null;
    loading: boolean;
    error: string | null;
    totalCount: number;
}

// export interface ProfileFormData {
//   fullName: string;
//   companyName: string;
//   bio: string;
//   country: string;
//   profilePicture: string;
// }