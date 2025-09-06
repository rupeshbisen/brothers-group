import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("id, role, name, email")
      .eq("user_id", data.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      user: {
        id: profile.id, // admin_profiles.id - used for foreign key references
        user_id: data.user.id, // auth.users.id - for reference
        email: profile.email, // Use email from admin_profiles for verification
        role: profile.role,
        name: profile.name,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
