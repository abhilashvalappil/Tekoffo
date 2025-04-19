// import { createSlice } from "@reduxjs/toolkit";
// import { updateUserProfile } from "../services/userService";
// import { ProfileState } from "../../types/userTypes";


// const initialState:ProfileState = {
//     profile: null,
//     loading: false,
//     error: null,
//     successMessage: null
// }

// const userSlice = createSlice({
//     name:'user',
//     initialState,
//     reducers:{},
//     extraReducers: (builder) => {
//         builder
//         .addCase(updateUserProfile.pending, (state) => {
//             console.log("console from pending..........")
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(updateUserProfile.fulfilled,(state,action) => {
//             state.loading = false;
//             state.profile = action.payload.userProfile;
//             console.log("console from fulfilleddd..........")
//             console.log("console from userslcie.tssssss",action.payload)
//             state.successMessage = action.payload.message;
//         })
//         .addCase(updateUserProfile.rejected,(state,action) => {
//             console.log("console from rejected..........")
//             state.loading = false;
//             state.error = action.payload as string;
//         })
//     }
// })

// export default userSlice.reducer;