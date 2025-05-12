import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    // Hiển thị một phần của key để kiểm tra xem biến môi trường có được đọc không
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + "..."
      : "Không có",
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
    testTime: new Date().toISOString(),
  });
}
