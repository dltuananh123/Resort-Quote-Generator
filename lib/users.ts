// Define User type
export interface User {
  id: string;
  full_name: string;
  email: string;
  pass: string;
  user_role: "admin" | "user";
}

// List of mock users for demo purposes
// In a real application, you should use a database
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
