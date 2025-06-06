import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RegisterPayload } from "../types/authTypes";
import { SignInCredentials,SignInResponse } from "../types/authTypes";
import API from "../../services/api"
import { commonENDPOINTS } from "../../constants/endpointUrl";


 
export const register = createAsyncThunk(
  "auth/register",
  async(payload: RegisterPayload,{rejectWithValue}) => {
    try {
      const response = await API.post(commonENDPOINTS.VERIFY_OTP,payload)
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errormsg = error.response?.data?.message
        console.log('the error from registe: ',errormsg)
        return rejectWithValue(
          error.response?.data?.message || "registration failed"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
)
 

export const signIn = createAsyncThunk <SignInResponse, SignInCredentials>(
  "auth/signin",
  async (
    credentials: SignInCredentials | { googleCredential: string | null },
    { rejectWithValue }
  ) => {
    try {
      if ("googleCredential" in credentials && credentials.googleCredential) {
        const response = await API.post(commonENDPOINTS.GOOGLE_SIGNIN,
          { credential: credentials.googleCredential });
        return response.data;
      } else {
        const response = await API.post(commonENDPOINTS.LOGIN, credentials)
        console.log('console from response authservice.ts',response.data)
        return response.data;
      }
    } catch (error) {
      console.log('Full error response:',error)
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Sign in failed";
        console.log("Backend error message:", errorMessage);
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async(userId:string, {rejectWithValue}) => {
    try {
      const response = await API.post(commonENDPOINTS.LOGOUT,{userId})
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Logout failed"
        );
      }
      return rejectWithValue("Logout failed");
    }
    
  }
)

