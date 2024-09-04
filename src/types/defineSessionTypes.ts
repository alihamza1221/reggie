// declare custom user type in next-auth session
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      image: string;
      provider: string;
    };
  }
}
