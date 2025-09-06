import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// GET - Fetch donations (Admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (
      !profile ||
      (profile.role !== "super_admin" && profile.role !== "content_admin")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // 'pending', 'completed', 'failed', 'refunded'
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get donations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new donation record
export async function POST(request: NextRequest) {
  try {
    const donationData = await request.json();

    // Validate required fields
    const requiredFields = ["donor_name", "amount", "payment_method"];
    for (const field of requiredFields) {
      if (!donationData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    // Generate unique transaction id if not provided
    const generatedTransactionId =
      donationData.transaction_id ||
      `DON-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from("donations")
      .insert([
        {
          ...donationData,
          transaction_id: generatedTransactionId,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email receipt (you can implement this later)
    // await sendDonationReceipt(data)

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create donation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
