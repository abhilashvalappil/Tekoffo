// D:\Tekoffo\frontend\src\redux\services\api\endpointUrl.ts
export const commonENDPOINTS = {
    SIGNUP: '/signup',
    LOGIN: '/signin',
    LOGOUT: '/logout',
    VERIFY_OTP: '/verify-otp',
    VERIFY_FORGOT_OTP: '/verify-forgot-otp',
    RESEND_OTP: '/resend-otp',
    FORGOT_PASS: '/forgot-password',
    RESET_PASS: '/reset-password',
    PROFILE: '/profile',
    GOOGLE_SIGNIN: '/google-auth',
  };

  export const adminENDPOINTS = {
    GET_USERS: "/admin/users",
    UPDATE_USER: "/admin/update-status",
    ADD_CATEGORY: "/admin/add-category",
    UPDATE_CATEGORY: "/admin/update-category",
    GET_CATEGORIES: "/admin/get-categories",
    UPDATE_CATEGORY_STATUS: "/admin/update-category-status",
  }

  export const userENDPOINTS = {
    CREATE_PROFILE: "/create-profile",
    UPDATE_PROFILE: "/update-profile",
    CREATE_FREELANCERPROFILE: "/create-freelancerprofile",
    UPDATE_FREELANCERPROFILE: "/update-freelancerprofile",
    CHANGE_PASSWORD: "/change-password",
    GET_LISTED_CATEGORIES: "/categories/listed",
    POST_JOB: "/jobs/post",
    UPDATE_JOB_POST: "/update-job",
    DELETE_JOB_POST: "/delete-job",
    // UPDATE_JOB_POST: (jobId: string) => `/update-job/${jobId}`,
    GET_MY_JOBS: "/jobs/my-posts",
    GET_POSTED_JOBS: "/jobs/posted",
    GET_Freelancers: "/freelancers",
  }