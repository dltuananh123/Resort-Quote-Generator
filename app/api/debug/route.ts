import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUserByEmail } from "@/lib/supabase-users";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  // Kiểm tra kết nối cơ bản với Supabase
  try {
    const { data: connectionTest, error: connectionError } = await supabase
      .from("users")
      .select("count(*)");

    if (connectionError) {
      return NextResponse.json({
        success: false,
        message: "Không thể kết nối với Supabase",
        error: connectionError,
      });
    }

    // Nếu có email, thử lấy thông tin người dùng
    let userData = null;
    if (email) {
      try {
        userData = await getUserByEmail(email);
      } catch (error) {
        console.error("Error fetching user by email:", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Kết nối Supabase thành công",
      connection: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Không có URL",
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      userCount: connectionTest?.[0]?.count || 0,
      userData: userData
        ? {
            id: userData.id,
            full_name: userData.full_name,
            email: userData.email,
            user_role: userData.user_role,
            // Không trả về mật khẩu
          }
        : null,
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({
      success: false,
      message: "Lỗi khi kiểm tra kết nối",
      error: String(error),
    });
  }
}
