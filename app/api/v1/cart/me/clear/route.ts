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
 * POST /api/v1/cart/me/clear
 * Clear all items from cart
 */
export async function POST(request: NextRequest) {
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

  const userId = decoded.userId;
  const cart = mockStore.getOrCreateCart(String(userId));

    // Clear all items
    cart.items = [];
    cart.subtotal = 0;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL_ERROR", message: "Failed to clear cart" },
      },
      { status: 500 }
    );
  }
}
