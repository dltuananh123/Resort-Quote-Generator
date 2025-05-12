// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserById, updateUser, deleteUser } from "@/lib/supabase-users";

// GET /api/users/[id] - Lấy thông tin người dùng cụ thể
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Xác thực quyền admin
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  });

  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Tìm người dùng theo ID
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Cập nhật thông tin người dùng
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

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

    // Verify user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with Supabase
    const updatedUser = await updateUser(id, data);
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error.message === "Email already exists") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    } else if (error.message === "Cannot demote the only admin") {
      return NextResponse.json(
        { error: "Cannot demote the only admin" },
        { status: 400 }
      );
    }

    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Xóa người dùng
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Xác thực quyền admin
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  });

  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteUser(id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.message === "Cannot delete the last admin user") {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }

    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
