import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/supabase-users";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "admin@asteria.com";
  const password = searchParams.get("password") || "password123";

  try {
    // Thử lấy thông tin người dùng từ Supabase
    const user = await getUserByEmail(email);

    // Kết quả truy vấn người dùng
    const authResult = {
      userFound: !!user,
      userDetails: user
        ? {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.user_role,
            passwordMatch: user.pass === password,
            actualPassword: user.pass.substring(0, 3) + "...", // Chỉ hiển thị 3 ký tự đầu
          }
        : null,
      supabaseConfig: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Được cấu hình" : "Thiếu",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "Được cấu hình"
          : "Thiếu",
      },
      nextAuthSecret: process.env.NEXTAUTH_SECRET
        ? "Được cấu hình"
        : "Sử dụng giá trị mặc định",
    };

    return NextResponse.json(authResult);
  } catch (error) {
    console.error("Auth debug error:", error);
    return NextResponse.json({
      error: String(error),
      message: "Lỗi khi thử đăng nhập",
    });
  }
}
