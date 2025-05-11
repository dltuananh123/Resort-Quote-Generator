// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { users, User } from "@/lib/users";

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

  // Trả về danh sách người dùng (đã loại bỏ mật khẩu)
  const safeUsers = users.map(({ password, ...user }) => user);
  return NextResponse.json(safeUsers);
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
    if (!data.email || !data.password || !data.name || !data.role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    if (users.some((user) => user.email === data.email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Tạo người dùng mới
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    users.push(newUser);

    // Trả về thông tin người dùng (đã loại bỏ mật khẩu)
    const { password, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
