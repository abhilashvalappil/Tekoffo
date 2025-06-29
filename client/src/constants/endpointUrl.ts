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
    GET_TOTAL_CLIENTS_COUNT: "/admin/users/count",
    UPDATE_USER: "/admin/update-status",
    ADD_CATEGORY: "/admin/add-category",
    UPDATE_CATEGORY: "/admin/update-category",
    GET_CATEGORIES: "/admin/get-categories",
    UPDATE_CATEGORY_STATUS: "/admin/update-category-status",
    GET_ACTIVEJOBS_COUNT: "/admin/api/active-jobs",
    GET_TOTAL_REVENUE: "/admin/total-revenue",
    GET_TOTAL_ESCROW_FUNDS: "/admin/escrow-funds",
    GET_ALL_TRANSACTIONS: "/admin/api/transactions",
  }

  export const userENDPOINTS = {
    //* profile
    CREATE_PROFILE: "/create-profile",
    UPDATE_PROFILE: "/update-profile",
    CREATE_FREELANCERPROFILE: "/create-freelancerprofile",
    UPDATE_FREELANCERPROFILE: "/update-freelancerprofile",
    CHANGE_PASSWORD: "/change-password",
    GET_LISTED_CATEGORIES: "/categories/listed",
    GET_Freelancers: "/freelancers",

    //* job
    CREATE_JOB: "/jobs",
    UPDATE_JOB_POST: "/update-job",
    DELETE_JOB_POST: "/delete-job",
    GET_MY_JOBS: "/jobs/my-posts",
    GET_ACTIVE_JOBS: "/jobs/active-jobs",
    GET_POSTED_JOBS: "/jobs/posted",
    GET_JOB_DETAILS: "/jobs/job",
    

    //* proposal
    SUBMIT_PROPOSAL: "/send-proposal",
    GET_RECEIVED_PROPOSALS: "/proposals/received",
    GET_PROPOSAL: "/proposals/proposal",
    GET_INVITATIONS_SENT: "/invitations/sent",
    UPDATE_PROPOSAL: "/proposals/update",
    CREATE_JOB_INVITE:"/create-invite",
    GET_JOB_INVITATIONS:'/invitations',
    FREELANCER_APPLIED_PROPOSALS: "/api/proposals",
    ACCEPT_INVITATION:'/invitations/accept',
    REJECT_INVITATION: "/invitations/reject",
    GET_CLIENT_PROFILE: '/api/profile',

    //* stripe
    GET_STRIPE_ACCOUNT: "/check-stripe-account",
    CREATE_STRIPE_CONNECT: "/onboard-freelancer",
    CREATE_PAYMENT_INTENT:'/create-payment-intent',
    
    //* contract
    CREATE_CONTRACT:'/create-contract',
    APPROVE_CONTRACT:'/release-payment',
    GET_CONTRACTS:'/contracts',
    SUBMIT_CONTRACT:'/contracts/submit',
    GET_ACTIVE_CONTRACTS:'/contracts/active',

    //* review
    CREATE_REVIEW:'/api/create-review',
    GET_SUBMITTED_REVIEWS: '/api/reviews/submitted',
    GET_REVIEWS:'/api/reviews',
    CHECK_REVIEW:'/api/reviews/check',

    //* WALLET
    GET_WALLET:'/api/wallet',
    WITHDRAW: '/api/wallet/withdraw',
    GET_TRANSACTIONS: '/api/wallet/transactions',
    
    //* message
    GET_CHATID: '/chats/chat',
    CREATE_CHAT: '/create-chat',
    SEND_MESSAGE: '/send-message',
    GET_CHATS: '/api/chats',
    GET_MESSAGES:'/api/messages',
    MARK_MESSAGES_AS_READ: '/api/messages/mark-read',
    GET_UNREAD_MESSAGES:'/api/messages/unread',
    DELETE_MSG: '/api/messages/delete-message',

    //* notification
    GET_NOTIFICATIONS: '/api/notifications',
    MARK_AS_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_AS_READ: '/api/notifications/mark-all-read',

    //* gig
    CREATE_GIG: '/create-gig',
    UPDATE_GIG: '/update-gig',
    DELETE_GIG: '/delete-gig',
    GET_GIGS: '/gigs',
    GET_FREELANCER_GIGS: '/freelancer/gigs',
    
    CREATE_CHECKOUT: "/create-checkout-session",
    GET_RECEIVER: "/api/user"
  }