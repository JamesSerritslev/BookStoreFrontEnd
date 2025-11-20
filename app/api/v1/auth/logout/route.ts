import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/v1/auth/logout
 * Invalidate JWT token (in real backend, token would be blacklisted)
 *
 * In mock mode, this is a no-op since we don't maintain a blacklist,
 * but we return success to match the contract
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 401 }
      );
    }

    // In mock mode, just return success
    // Real backend would blacklist the token
    return NextResponse.json(
      { message: "Successfully logged out" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout service unavailable" },
      { status: 500 }
    );
  }
}
