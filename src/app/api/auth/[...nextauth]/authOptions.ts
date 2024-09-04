import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/db/mongooseConnect";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { email, name, image, id } = user;
      if (!email) return false;
      try {
        await dbConnect();
        const existingUser = null;
        const newUser = null;
      } catch (err) {
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
