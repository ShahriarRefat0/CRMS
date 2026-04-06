// src/auth.config.js
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      // logic handles in auth.js
    }),
  ],
}
