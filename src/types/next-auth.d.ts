import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      practiceId: string;
    } & DefaultSession["user"];
  }

  interface User {
    practiceId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    practiceId?: string;
  }
}
