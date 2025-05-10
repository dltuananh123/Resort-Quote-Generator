import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Danh sách người dùng giả lập cho mục đích demo
// Trong ứng dụng thực tế, bạn sẽ sử dụng cơ sở dữ liệu
const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@asteria.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "2",
    name: "Staff",
    email: "staff@asteria.com",
    password: "password123",
    role: "staff",
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // Tên hiển thị trên form đăng nhập
      name: "Asteria Resort",
      // Cấu hình các trường cho form đăng nhập
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@asteria.com",
        },
        password: { label: "Mật khẩu", type: "password" },
      },
      // Hàm xác thực
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Tìm người dùng trong danh sách giả lập
        const user = users.find(
          (user) =>
            user.email === credentials.email &&
            user.password === credentials.password
        );

        // Nếu không tìm thấy người dùng, trả về null
        if (!user) {
          return null;
        }

        // Trả về thông tin người dùng (không bao gồm mật khẩu)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  // Tùy chỉnh trang đăng nhập
  pages: {
    signIn: "/login",
  },
  // Thiết lập các callbacks
  callbacks: {
    // Bổ sung thông tin người dùng vào token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Bổ sung thông tin người dùng vào phiên session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.sub;
      }
      return session;
    },
  },
  // Cấu hình bảo mật
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 ngày
  },
  // Secret key cho JWT (trong môi trường thực tế nên dùng biến môi trường)
  secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
});

export { handler as GET, handler as POST };
