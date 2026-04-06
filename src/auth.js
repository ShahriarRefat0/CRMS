import NextAuth from "next-auth"
import authConfig from "./auth.config"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.map((p) => {
      if (p.id === "credentials") {
        return {
          ...p,
          async authorize(credentials) {
            await dbConnect();

            const identifier = (credentials?.identifier || '').trim();
            const otp = credentials?.otp || '';

            if (!identifier || !otp) {
              throw new Error('ইমেইল/মোবাইল এবং OTP উভয় প্রয়োজন');
            }

            const user = await User.findOne({
              $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
            });

            if (!user) throw new Error('ইউজার পাওয়া যায়নি');

            // OTP Validation logic
            if (!user.otpexp || Date.now() > new Date(user.otpexp).getTime()) {
              throw new Error('OTP এর মেয়াদ শেষ');
            }

            if (user.otp !== otp) {
              throw new Error('OTP সঠিক নয়');
            }

            // Clear OTP after success
            user.otp = null;
            user.otpexp = null;
            await user.save();

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              phone: user.phone,
              image: user.image,
              role: user.role,
              nid: user.nid,
              area: user.area,
              bio: user.bio,
            };
          },
        }
      }
      return p
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect()
        let existing = await User.findOne({ email: user.email })
        
        if (!existing) {
          existing = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            role: "user"
          })
        } else {
          // যদি ইউজার আগে থেকেই থাকে, গুগলের লেটেস্ট ছবি আপডেট করে নিতে পারেন
          existing.image = user.image;
          await existing.save();
        }

        user.id = existing._id.toString();
        user.phone = existing.phone;
        user.role = existing.role;
        user.bio = existing.bio;
        user.nid = existing.nid;
        user.area = existing.area;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // First time user signs in
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.image = user.image;
        token.phone = user.phone;
        token.nid = user.nid;
        token.area = user.area;
        token.bio = user.bio;

        // For Google sign-in, double check we have the latest from DB
        if (token.email && !token.role) {
           await dbConnect();
           const dbUser = await User.findOne({ email: token.email });
           if (dbUser) {
             token.sub = dbUser._id.toString();
             token.role = dbUser.role;
             token.image = dbUser.image || token.image;
             token.phone = dbUser.phone;
             token.nid = dbUser.nid;
             token.area = dbUser.area;
             token.bio = dbUser.bio;
           }
        }
      }

      // Handle session update (from update() call on client)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name || token.name;
        token.email = session.user.email || token.email;
        token.phone = session.user.phone || token.phone;
        token.role = session.user.role || token.role;
        token.bio = session.user.bio || token.bio;
        token.nid = session.user.nid || token.nid;
        token.area = session.user.area || token.area;
        token.image = session.user.image || token.image;
      } else if (trigger === "update" && session?.image) {
        token.image = session.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.nid = token.nid;
        session.user.area = token.area;
        session.user.bio = token.bio;
        session.user.image = token.image;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
});

