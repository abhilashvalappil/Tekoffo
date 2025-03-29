import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types/authTypes";
import {signUp,signIn} from '../services/authService'

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
        logout:(state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        login:(state,action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.successMessage = action.payload.message;
        },
        clearMessages:(state) => {
          state.error = null;
          state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message || "Signup failed";
        state.error = action.payload?.message || 'Signup failed';
      })

      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
    },
})

export const { logout,login,clearMessages } = authSlice.actions;
export default authSlice.reducer;