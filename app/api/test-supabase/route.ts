import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Check if supabase is instantiated
    const supabaseInfo = {
      isMockClient:
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      envVars: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    };

    // Try to connect to Supabase
    const { data, error } = await supabase
      .from("quotes")
      .select("count")
      .limit(1);

    return NextResponse.json({
      supabaseInfo,
      testResult: {
        success: !error,
        data,
        error: error ? error.message : null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
