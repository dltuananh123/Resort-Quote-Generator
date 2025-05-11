// Định nghĩa kiểu User
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

// Danh sách người dùng giả lập cho mục đích demo
// Trong ứng dụng thực tế, nên sử dụng cơ sở dữ liệu
export const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@asteria.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "2",
    name: "User",
    email: "user@asteria.com",
    password: "password123",
    role: "user",
  },
];
