import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateToken } from "@/lib/jwt";
import { users, User } from "@/lib/users";

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

        const user = users.find(
          (user: User) =>
            user.email === credentials.email &&
            user.password === credentials.password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
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
});

export { handler as GET, handler as POST };
