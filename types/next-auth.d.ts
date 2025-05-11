import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Mở rộng kiểu dữ liệu User để bao gồm trường role
   */
  interface User {
    id: string;
    role: "admin" | "user";
    email: string;
    name?: string;
  }

  /**
   * Mở rộng kiểu dữ liệu Session để bao gồm trường role trong user
   */
  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
    token: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Mở rộng kiểu dữ liệu JWT để bao gồm trường role
   */
  interface JWT {
    id: string;
    role: "admin" | "user";
    email: string;
    name?: string;
  }
}
