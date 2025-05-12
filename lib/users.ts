// User type definition
export interface User {
  id: string;
  full_name: string;
  email: string;
  pass: string;
  user_role: "admin" | "user";
}

// Mock user list for demo purposes
// In a real application, a database should be used
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
