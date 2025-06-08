// src/config/index.ts
export default {
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASS: process.env.USER_PASS,
    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET!,
    CLIENT_ID: process.env.CLIENT_ID,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
  };

  export const JWT_SECRET = process.env.JWT_SECRET as string