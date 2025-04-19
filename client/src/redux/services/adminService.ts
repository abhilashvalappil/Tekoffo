import { createAsyncThunk } from "@reduxjs/toolkit";
import   { AxiosError } from "axios";
import { User } from "../types/authTypes";
import API from "./api/baseUrl";
import { adminENDPOINTS } from "./api/endpointUrl";


interface FetchUsersResponse {
    users: User[];
    totalCount: number;
  }

  interface ErrorResponse {
    message: string;
    status?: number;
  }

  interface UpdateUserStatusResponse {
    userId: string;
    isBlocked: boolean;
  }

 

// export const fetchUsers = createAsyncThunk<
// FetchUsersResponse,
//   void,
//   { rejectValue: ErrorResponse }>(
//   "users/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await API.get(adminENDPOINTS.GET_USERS);
//       const { data } = response.data;  
//       return {
//         users: data.users,
//         totalCount: data.totalCount,
//       };
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       if (axiosError.response) {
//         return rejectWithValue({
//           message: axiosError.response.data.message || "Failed to fetch users",
//           status: axiosError.response.status
//         });
//       }
//       return rejectWithValue({
//         message: "Network error occurred while fetching users"
//       });
//     }
//   }
// );

 
// export const updateUserStatus = createAsyncThunk<
//   UpdateUserStatusResponse,
//   { userId: string; isBlocked: boolean },
//   { rejectValue: ErrorResponse }
// >(
//   "users/updateUserStatus",
//   async ({ userId, isBlocked }, { rejectWithValue }) => {
//     try {
//       const response = await API.post(adminENDPOINTS.UPDATE_USER, {
//         userId,
//         isBlocked,
//       });
//       return { userId, isBlocked: response.data.user.isBlocked };  
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       return rejectWithValue({
//         message: axiosError.response?.data.message || "Failed to update user status",
//         status: axiosError.response?.status,
//       });
//     }
//   }
// );