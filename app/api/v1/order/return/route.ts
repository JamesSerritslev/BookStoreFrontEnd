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
 * POST /api/v1/order/return
 * Process order return
 */
export async function POST(request: NextRequest) {
  try {
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, cartId } = body;

    // Validation
    if (!userId || !cartId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Find order
    const order = mockStore.orders.find(
      (o) => o.userId === userId && o.cartId === cartId
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    order.status = "Cancelled";

    return NextResponse.json(
      { message: "Success! The order return is now being processed." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Return order error:", error);
    return NextResponse.json(
      { error: "Failed to process return" },
      { status: 500 }
    );
  }
}
