import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    // Display part of the key to check if environment variables are being read correctly
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + "..."
      : "Not found",
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
    testTime: new Date().toISOString(),
  });
}
