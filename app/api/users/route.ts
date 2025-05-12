// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUsers, createUser } from "@/lib/supabase-users";

// GET /api/users - Lấy danh sách người dùng
export async function GET(request: NextRequest) {
  // Xác thực quyền admin
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  });

  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Lấy danh sách người dùng từ Supabase
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Thêm người dùng mới
export async function POST(request: NextRequest) {
  // Xác thực quyền admin
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  });

  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!data.email || !data.pass || !data.full_name || !data.user_role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Tạo người dùng mới trong Supabase
    const newUser = await createUser({
      full_name: data.full_name,
      email: data.email,
      pass: data.pass,
      user_role: data.user_role,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error.message === "Email already exists") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
