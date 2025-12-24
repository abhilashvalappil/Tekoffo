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
 