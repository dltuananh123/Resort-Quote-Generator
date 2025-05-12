import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateToken } from "@/lib/jwt";
import { getUserByEmail } from "@/lib/supabase-users";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Asteria Resort",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@asteria.com",
        },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await getUserByEmail(credentials.email);

          console.log("Found user:", user); // For debugging

          if (!user || user.pass !== credentials.password) {
            console.log("Password mismatch or user not found"); // For debugging
            return null;
          }

          return {
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.user_role,
          };
        } catch (error) {
          console.error("Error authenticating user:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - User:", user); // For debugging
      console.log("JWT Callback - Token:", token); // For debugging

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token); // For debugging
      console.log("Session Callback - Session:", session); // For debugging

      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      session.token = generateToken({
        id: token.id,
        email: token.email as string,
        role: token.role,
      });

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  debug: true, // Bật debug mode để có thêm log
});

export { handler as GET, handler as POST };
