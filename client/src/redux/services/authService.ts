import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { User } from "../types/authTypes";
import { SignInCredentials, GoogleSignUpCredentials } from "../types/authTypes";
import API from "./api/baseUrl";
import { commonENDPOINTS } from "./api/endpointUrl";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (UserData: User, { rejectWithValue }) => {
    try {
      const response = await API.post(commonENDPOINTS.SIGNUP, UserData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      // console.log("authserviceeeeeeeeeeeee",error)
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "An unknown error occurred" });
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signin",
  async (
    credentials: SignInCredentials | { googleCredential: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      if ("googleCredential" in credentials && credentials.googleCredential) {
        const response = await API.post(
          commonENDPOINTS.GOOGLE_SIGNIN,
          { credential: credentials.googleCredential },
          { withCredentials: true }
        );
        return response.data;
      } else {
        const response = await API.post(commonENDPOINTS.LOGIN, credentials, {
          withCredentials: true,
        });
        console.log("my responseeeeeeeeeeeeeeee",response)
        return response.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Sign in failed"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
