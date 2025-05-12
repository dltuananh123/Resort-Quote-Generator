// Định nghĩa kiểu User
export interface User {
  id: string;
  full_name: string;
  email: string;
  pass: string;
  user_role: "admin" | "user";
}

// Danh sách người dùng giả lập cho mục đích demo
// Trong ứng dụng thực tế, nên sử dụng cơ sở dữ liệu
export const users: User[] = [
  {
    id: "1",
    full_name: "Admin",
    email: "admin@asteria.com",
    pass: "password123",
    user_role: "admin",
  },
  {
    id: "2",
    full_name: "User",
    email: "user@asteria.com",
    pass: "password123",
    user_role: "user",
  },
];
