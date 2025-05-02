import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types/authTypes";
import {signIn,logout,register} from '../services/authService'
import { createUserProfile,updateUserProfile,createFreelancerProfile,updateFreelancerProfile } from "../services/userService";


const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated:false,    
    successMessage: null
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
        console.log('console from authslice error testing',action.payload)
      })

      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        console.log('Sign-in payload user:', action.payload.user);
      })

      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        // console.log('console from authslice error testing',action.payload)
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
          console.log("console from pending..........")
          state.loading = true;
          state.error = null;
      })
      .addCase(createUserProfile.fulfilled,(state,action) => {
          state.loading = false;
          state.user = action.payload.userProfile
          console.log("console from fulfilleddd..........")
          console.log("console from userslcie.tssssss",action.payload)
          state.successMessage = action.payload.message;
      })
      .addCase(createUserProfile.rejected,(state,action) => {
          console.log("console from rejected..........")
          state.loading = false;
          state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        console.log("console from pending..........")
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled,(state,action) => {
        state.loading = false;
        state.user = action.payload.userProfile
        console.log("console from fulfilleddd..........")
        console.log("console from userslcie.tssssss",action.payload)
        state.successMessage = action.payload.message;
      })
      .addCase(updateUserProfile.rejected,(state,action) => {
        console.log("console from rejected..........")
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFreelancerProfile.pending, (state) => {
        console.log("console from pending..........")
        state.loading = true;
        state.error = null;
       })
      .addCase(createFreelancerProfile.fulfilled,(state,action) => {
        state.loading = false;
        state.user = action.payload.userProfile
        console.log("console from fulfilleddd..........")
        console.log("console from frelancerprofile authslice.ts",action.payload)
        state.successMessage = action.payload.message;
      })
      .addCase(createFreelancerProfile.rejected,(state,action) => {
        console.log("console from rejected..........")
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFreelancerProfile.pending, (state) => {
        console.log("console from pending..........")
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFreelancerProfile.fulfilled,(state,action) => {
        state.loading = false;
        state.user = action.payload.userProfile
        console.log("console from fulfilleddd..........")
        console.log("console from updateFreelancerProfile authslcie.ts",action.payload)
        state.successMessage = action.payload.message;
      })
      .addCase(updateFreelancerProfile.rejected,(state,action) => {
        console.log("console from rejected..........")
        state.loading = false;
        state.error = action.payload as string;
      })
    },
})

export const { clearMessages, updateUserData } = authSlice.actions;
export default authSlice.reducer;