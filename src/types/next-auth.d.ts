// types/next-auth.d.ts

export declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      provider: string;
    };
  }
}
export declare module "next-auth" {}
