// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { users } from "@/lib/users";

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

  // Tìm người dùng theo ID
  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Trả về thông tin người dùng (đã loại bỏ mật khẩu)
  const { password, ...safeUser } = user;
  return NextResponse.json(safeUser);
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

    // Tìm người dùng theo ID
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Không cho phép cập nhật user admin duy nhất thành user thường
    if (
      users[userIndex].id === "1" &&
      data.role === "user" &&
      users.filter((u) => u.role === "admin").length === 1
    ) {
      return NextResponse.json(
        { error: "Cannot demote the only admin" },
        { status: 400 }
      );
    }

    // Kiểm tra email tồn tại nếu email thay đổi
    if (
      data.email &&
      data.email !== users[userIndex].email &&
      users.some((u) => u.email === data.email)
    ) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Cập nhật thông tin người dùng
    users[userIndex] = {
      ...users[userIndex],
      name: data.name || users[userIndex].name,
      email: data.email || users[userIndex].email,
      // Chỉ cập nhật mật khẩu nếu có gửi mật khẩu mới
      password: data.password || users[userIndex].password,
      role: data.role || users[userIndex].role,
    };

    // Trả về thông tin người dùng đã cập nhật (đã loại bỏ mật khẩu)
    const { password, ...safeUser } = users[userIndex];
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
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

  // Tìm người dùng theo ID
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Kiểm tra nếu là admin cuối cùng
  if (
    users[userIndex].role === "admin" &&
    users.filter((u) => u.role === "admin").length === 1
  ) {
    return NextResponse.json(
      { error: "Cannot delete the last admin user" },
      { status: 400 }
    );
  }

  // Xóa người dùng
  const [deletedUser] = users.splice(userIndex, 1);

  // Trả về thông báo thành công
  return NextResponse.json({ message: "User deleted successfully" });
}
