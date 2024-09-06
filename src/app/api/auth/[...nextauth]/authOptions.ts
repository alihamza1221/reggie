import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/db/mongooseConnect";
import { userModel } from "@/db/models/user";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          provider: "Google",
        };
      },
    }),
  ],
  callbacks: {
    //@ts-ignore
    //user is received as params user can be passed from jwt to session for security
    async signIn({ user }) {
      if (!user) return false;
      try {
        await dbConnect();
        const existingUser = await userModel.findOne({ email: user.email });
        if (existingUser) {
          console.log("user already exists\n");
          return true;
        }

        const newUser = await userModel.create({
          ...user,
        });
        newUser.save();
      } catch (err) {
        return false;
      }

      return true;
    },
    //@ts-ignore
    async jwt({ token, user }) {
      console.log("api/auth/jwt callback user ->", user, "token_>", token);
      return token;
    },
    //update user in session

    /* @session.user = { 
        username: string;
        email: string;
        image: string;
         } */
    //@ts-ignore
    async session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.provider = "Google";
      console.log("api/auth/nextauth session callback->:", session);
      /*  @session.user = { 
        id: "sdjfj2323r2klje934";
        username: "username";
        email: email@gmail.com;
        image: https://example.com/image.jpg;
        provider: "Google";
      } */
      return session;
    },
  },
  pages: {
    signIn: "",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
