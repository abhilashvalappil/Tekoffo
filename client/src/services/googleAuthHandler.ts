// src/utils/googleAuthHandler.ts
import { CredentialResponse } from '@react-oauth/google';
import { AppDispatch } from '../redux/store';
import { signIn } from '../redux/services/authService';
import { setGoogleCredential } from '../redux/slices/authSlice';
import API from './api';  
import { handleApiError } from '../utils/errors/errorHandler';
import { NavigateFunction } from 'react-router-dom';

interface GoogleSuccessParams {
  credentialResponse: CredentialResponse;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  setServerError: (msg: string) => void;
}

const handleGoogleSuccess = async ({
  credentialResponse,
  dispatch,
  navigate,
  setServerError,
}: GoogleSuccessParams) => {
  try {
    const credential = credentialResponse.credential;
    const userExist = await API.post('/auth/check-user', { credential });

    if (userExist.data.result.user) {
      const result = await dispatch(signIn({ googleCredential: credential }));
      if (signIn.fulfilled.match(result)) {
        const userRole = result.payload?.user?.role;
        const redirectTo = userRole === 'freelancer' ? '/freelancer' : '/client';
        navigate(redirectTo);
      } else {
        setServerError((result.payload as string) || 'Google Sign-In failed');
      }
    } else {
      dispatch(setGoogleCredential(credential));
      navigate('/signup-as');
    }
  } catch (error) {
    const errormessage = handleApiError(error);
    setServerError(errormessage);
  }
};

export default handleGoogleSuccess;