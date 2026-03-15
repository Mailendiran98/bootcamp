import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type"); // "signup", "recovery", "invite", etc.

  if (code) {
    const supabase = createServerSupabaseClient();

    // Sign out any existing session first so the new token can be properly exchanged
    await supabase.auth.signOut();

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // For signup confirmations, redirect to login with a success message
  if (type === "signup") {
    return NextResponse.redirect(
      new URL("/login?verified=true", requestUrl.origin)
    );
  }

  // For password recovery, redirect to reset-password
  if (type === "recovery") {
    return NextResponse.redirect(
      new URL("/reset-password", requestUrl.origin)
    );
  }

  // Default: redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
