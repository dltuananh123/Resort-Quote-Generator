import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Mở rộng kiểu dữ liệu User để bao gồm trường role
   */
  interface User {
    role?: string;
  }

  /**
   * Mở rộng kiểu dữ liệu Session để bao gồm trường role trong user
   */
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Mở rộng kiểu dữ liệu JWT để bao gồm trường role
   */
  interface JWT {
    role?: string;
  }
}
