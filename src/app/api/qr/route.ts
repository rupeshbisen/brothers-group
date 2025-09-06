import { NextRequest, NextResponse } from "next/server";

// POST - Generate QR code for website URL
export async function POST(request: NextRequest) {
  try {
    const { url, size = 256, margin = 2 } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Validate size and margin
    if (size < 64 || size > 1024) {
      return NextResponse.json(
        { error: "Size must be between 64 and 1024" },
        { status: 400 }
      );
    }

    if (margin < 0 || margin > 10) {
      return NextResponse.json(
        { error: "Margin must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Generate QR code URL using a QR code service
    // You can use services like QR Server, Google Charts, or generate locally
    const qrCodeUrl = `${process.env.QR_CREATE_API_URI}/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=${margin}`;

    return NextResponse.json({
      qrCodeUrl,
      originalUrl: url,
      size,
      margin,
    });
  } catch (error) {
    console.error("QR code generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Generate QR code for website URL (with query parameters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const size = parseInt(searchParams.get("size") || "256");
    const margin = parseInt(searchParams.get("margin") || "2");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Validate size and margin
    if (size < 64 || size > 1024) {
      return NextResponse.json(
        { error: "Size must be between 64 and 1024" },
        { status: 400 }
      );
    }

    if (margin < 0 || margin > 10) {
      return NextResponse.json(
        { error: "Margin must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Generate QR code URL
    const qrCodeUrl = `${process.env.QR_CREATE_API_URI}/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=${margin}`;

    return NextResponse.json({
      qrCodeUrl,
      originalUrl: url,
      size,
      margin,
    });
  } catch (error) {
    console.error("QR code generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
