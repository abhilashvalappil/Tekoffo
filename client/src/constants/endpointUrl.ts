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
    ADD_CATEGORY: "/admin/categories",
    UPDATE_CATEGORY: "/admin/categories",
    GET_CATEGORIES: "/admin/categories",
    UPDATE_CATEGORY_STATUS: "/admin/categories/status",
    GET_ACTIVEJOBS_COUNT: "/admin/activejobs",
    GET_TOTAL_REVENUE: "/admin/revenue",
    GET_TOTAL_ESCROW_FUNDS: "/admin/escrow-funds",
    GET_ALL_TRANSACTIONS: "/admin/transactions",
  }

  export const userENDPOINTS = {
    //* profile
    CREATE_PROFILE: "/client/profile",
    UPDATE_PROFILE: "/client/profile",
    CREATE_FREELANCERPROFILE: "/freelancer/profile",
    UPDATE_FREELANCERPROFILE: "/freelancer/profile",
    CHANGE_PASSWORD: "/change-password",
    GET_LISTED_CATEGORIES: "/categories/all",
    GET_Freelancers: "/freelancers",

    //* job
    CREATE_JOB: "/jobs",
    UPDATE_JOB: "/jobs",
    DELETE_JOB: "/jobs",
    GET_MY_JOBS: "/jobs",
    GET_ACTIVE_JOBS: "/jobs/active",
    GET_JOBS: "/jobs/available",
    GET_JOB_DETAILS: "/jobs",
    

    //* proposal
    CREATE_PROPOSAL: "/proposals",
    CLIENT_PROPOSALS: "/clients/me/proposals",
    GET_PROPOSAL: "/proposals",
    GET_INVITATIONS_SENT: "/invitations/sent",
    UPDATE_PROPOSAL: "/proposals",
    CREATE_JOB_INVITE:"/invitations",
    GET_JOB_INVITATIONS:'/invitations',
    FREELANCER_PROPOSALS: "/proposals",
    ACCEPT_INVITATION: (proposalId: string) => `/invitations/${proposalId}/accept`,
    REJECT_INVITATION: (proposalId: string) => `/invitations/${proposalId}/reject`,  
    GET_CLIENT_PROFILE: '/profile',

    //* stripe
    // GET_STRIPE_ACCOUNT: "/check-stripe-account",
    GET_STRIPE_ACCOUNT: "/freelancers",
    CREATE_STRIPE_CONNECT: "/onboard-freelancer",
    CREATE_PAYMENT_INTENT:'/payment-intent',
    
    //* contract
    CREATE_CONTRACT:'/contracts',
    GET_CONTRACTS:'/contracts',
    // SUBMIT_CONTRACT:'/contracts/submit',
    SUBMIT_CONTRACT: (contractId: string) => `/contracts/${contractId}/submit`,
    APPROVE_CONTRACT:'/release-payment',
    GET_ACTIVE_CONTRACTS:'/contracts/active',

    //* review
    CREATE_REVIEW:'/reviews',
    GET_SUBMITTED_REVIEWS: '/reviews/submitted',
    GET_REVIEWS:'/reviews',
    CHECK_REVIEW:'/api/reviews/check',
    GET_REVIEW_STATS:'/review-stats',

    //* WALLET
    GET_WALLET:'/wallet',
    WITHDRAW: '/wallet/withdrawals',
    GET_TRANSACTIONS: '/wallet/transactions',
    
    //* message
    GET_CHATID: '/chats/chat',
    CREATE_CHAT: '/chat',
    SEND_MESSAGE: '/message',
    GET_CHATS: '/chats',
    GET_MESSAGES:'/messages',
    MARK_MESSAGES_AS_READ: '/messages/mark-read',
    GET_UNREAD_MESSAGES:'/messages/unread',
    DELETE_MSG: '/messages/delete-message',

    //* notification
    GET_NOTIFICATIONS: '/notifications',
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_AS_READ: '/notifications/read-all',

    //* gig
    CREATE_GIG: '/gigs',
    UPDATE_GIG: '/gigs',
    DELETE_GIG: '/gigs',
    GET_GIGS: '/gigs/all',
    GET_FREELANCER_GIGS: '/gigs',
    
    CREATE_CHECKOUT: "/checkout-session",
    GET_USER: "/users"
  }