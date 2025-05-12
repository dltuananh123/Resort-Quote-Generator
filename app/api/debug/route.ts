import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUserByEmail } from "@/lib/supabase-users";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  // Check basic connection with Supabase
  try {
    const { data: connectionTest, error: connectionError } = await supabase
      .from("users")
      .select("count(*)");

    if (connectionError) {
      return NextResponse.json({
        success: false,
        message: "Unable to connect to Supabase",
        error: connectionError,
      });
    }

    // If email is provided, try to get user information
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
      message: "Supabase connection successful",
      connection: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "No URL",
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      userCount: connectionTest?.[0]?.count || 0,
      userData: userData
        ? {
            id: userData.id,
            full_name: userData.full_name,
            email: userData.email,
            user_role: userData.user_role,
            // Don't return password
          }
        : null,
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({
      success: false,
      message: "Error checking connection",
      error: String(error),
    });
  }
}
