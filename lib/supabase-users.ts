import { supabase } from "@/lib/supabase";

// User type definition
export interface User {
  id: string;
  full_name: string;
  email: string;
  pass: string; // Note: In a production app, passwords should not be stored in plain text
  user_role: "admin" | "user";
  created_at?: string;
}

// Type without password for safe return
export type SafeUser = Omit<User, "pass">;

// Get all users (without passwords)
export async function getUsers(): Promise<SafeUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, user_role, created_at")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data || [];
}

// Get user by ID (without password)
export async function getUserById(id: string): Promise<SafeUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, user_role, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
}

// Get user by email (with password for authentication)
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }

  return data;
}

// Create a new user
export async function createUser(
  user: Omit<User, "id" | "created_at">
): Promise<SafeUser> {
  // Check if email already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", user.email)
    .single();

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select("id, full_name, email, user_role, created_at");

  if (error) {
    console.error("Error creating user:", error);
    throw error;
  }

  return data?.[0] as SafeUser;
}

// Update a user
export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<SafeUser> {
  // If email is being updated, check if it's already taken
  if (updates.email) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", updates.email)
      .neq("id", id)
      .single();

    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select("id, full_name, email, user_role, created_at");

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data?.[0] as SafeUser;
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  // First check if this is the only admin
  if (id) {
    const { data: user } = await supabase
      .from("users")
      .select("user_role")
      .eq("id", id)
      .single();

    if (user?.user_role === "admin") {
      const { data: admins, error } = await supabase
        .from("users")
        .select("id")
        .eq("user_role", "admin");

      if (!error && admins && admins.length <= 1) {
        throw new Error("Cannot delete the last admin user");
      }
    }
  }

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }

  return true;
}
