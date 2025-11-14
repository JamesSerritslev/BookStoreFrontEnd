import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mock/data";

/**
 * POST /api/v1/auth/refresh
 * Refresh an expired or soon-to-expire JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Decode token
    let decoded: any;
    try {
      decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Find user
    const user = mockStore.users.find((u) => u.id === decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Generate new token
    const newToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })
    ).toString("base64");

    // Return new AuthResponse
    return NextResponse.json(
      {
        token: newToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Token refresh service unavailable" },
      { status: 500 }
    );
  }
}
