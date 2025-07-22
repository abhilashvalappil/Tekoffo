import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types/authTypes";
import {signIn,logout,register} from '../services/authService'
import { createUserProfile,updateUserProfile,createFreelancerProfile,updateFreelancerProfile } from "../services/userService";


const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated:false,    
    successMessage: null,
    googleCredential: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        clearMessages:(state) => {
          state.error = null;
          state.successMessage = null;
        }, 
        updateUserData : (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        },
         setGoogleCredential: (state, action) => {
          state.googleCredential = action.payload;
        }
    },
    extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state,action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
         
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error =  action.payload as string;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.successMessage = "Logged out successfully";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUserProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(createUserProfile.fulfilled,(state,action) => {
          state.loading = false;
          state.user = action.payload.userProfile
          state.successMessage = action.payload.message;
      })
      .addCase(createUserProfile.rejected,(state,action) => {
          state.loading = false;
          state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled,(state,action) => {
        state.loading = false;
        state.user = action.payload.userProfile
        state.successMessage = action.payload.message;
      })
      .addCase(updateUserProfile.rejected,(state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFreelancerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
       })
      .addCase(createFreelancerProfile.fulfilled,(state,action) => {
        state.loading = false;
        state.user = action.payload.userProfile
        state.successMessage = action.payload.message;
      })
      .addCase(createFreelancerProfile.rejected,(state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFreelancerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFreelancerProfile.fulfilled,(state,action) => {
        state.loading = false;
        state.user = action.payload.userProfile
        state.successMessage = action.payload.message;
      })
      .addCase(updateFreelancerProfile.rejected,(state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    },
})

export const { clearMessages, updateUserData, setGoogleCredential } = authSlice.actions;
export default authSlice.reducer;