import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/mock/data";

/**
 * Helper to decode token
 */
function decodeToken(request: NextRequest): any {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * GET /api/v1/cart/me
 * Get authenticated user's cart
 */
export async function GET(request: NextRequest) {
  try {
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          error: { code: "UNAUTHORIZED", message: "Invalid or missing token" },
        },
        { status: 401 }
      );
    }

  const userId = decoded.userId; // numeric
  const cart = mockStore.getOrCreateCart(String(userId));

    return NextResponse.json(
      {
        success: true,
        message: "Cart retrieved",
        data: cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL_ERROR", message: "Failed to retrieve cart" },
      },
      { status: 500 }
    );
  }
}
