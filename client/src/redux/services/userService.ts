import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../services/api"
import { userENDPOINTS } from "../../constants/endpointUrl";
import { UserProfileResponse } from "../../types/userTypes"


export const createUserProfile = createAsyncThunk<
  { message: string; userProfile: UserProfileResponse },
  FormData, // Changed to FormData
  { rejectValue: string }
>(
  'auth/createUserProfile',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Sending FormData to API:', payload);
      const response = await API.post(userENDPOINTS.CREATE_PROFILE, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        },
      });
      console.log('API response from create userprofileeeeeeee,reduxxx:', response.data);
      return {
        message: response.data.message,
        userProfile: response.data.userProfile,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Profile update failed'
        );
      }
      return rejectWithValue('Unexpected error occurred while updating profile');
    }
  }
);


export const updateUserProfile = createAsyncThunk<
  { message: string; userProfile: UserProfileResponse },
  FormData,  
  { rejectValue: string }
>(
  'auth/updateUserProfile',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Sending FormData to API:', payload);
      const response = await API.put(userENDPOINTS.UPDATE_PROFILE, payload, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      console.log('API response from update userprofile,redxxx:', response.data);
      return {
        message: response.data.message,
        userProfile: response.data.userProfile,
      };
    } catch (error) {
      console.log('the type of error issssssss',error)
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Profile update failed'
        );
      }
      return rejectWithValue('Unexpected error occurred while updating profile');
    }
  }
);




export const createFreelancerProfile = createAsyncThunk<
{ message: string; userProfile: UserProfileResponse },
FormData,
{ rejectValue: string }
>(
    'auth/createFreelancerProfile',
    async(payload, {rejectWithValue}) => {
        try {
            const response = await API.post(userENDPOINTS.CREATE_FREELANCERPROFILE, payload, {
                headers: {
                  'Content-Type': 'multipart/form-data',  
                },
              });
              console.log('API response from freelancer profile creationnnnnn:', response.data);
              return {
                message: response.data.message,
                userProfile: response.data.userProfile,
              };
            } catch (error) {
              if (error instanceof AxiosError) {
                return rejectWithValue(
                  error.response?.data?.message || 'Profile update failed'
                );
              }
              return rejectWithValue('Unexpected error occurred while updating profile');
            }
          }
        );



    export const updateFreelancerProfile = createAsyncThunk<
    { message: string; userProfile: UserProfileResponse },
    FormData,  
    { rejectValue: string }
  >(
    'auth/updateFreelancerProfile',
    async (payload, { rejectWithValue }) => {
      try {
        console.log('Sending updatefreelancer profile to API:', payload);
        const response = await API.put(userENDPOINTS.UPDATE_FREELANCERPROFILE, payload, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        });
        console.log('API response from update userprofile,redxxx:', response.data);
        return {
          message: response.data.message,
          userProfile: response.data.userProfile,
        };
      } catch (error) {
        console.log('the type of error issssssss',error)
        if (error instanceof AxiosError) {
          return rejectWithValue(
            error.response?.data?.message || 'Profile update failed'
          );
        }
        return rejectWithValue('Unexpected error occurred while updating profile');
      }
    }
  );