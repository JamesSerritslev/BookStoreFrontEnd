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
 * GET /api/v1/order
 * Get orders based on user role:
 * - BUYER: orders they purchased
 * - SELLER: orders for books they listed
 * - ADMIN: all orders
 */
export async function GET(request: NextRequest) {
  try {
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const userId = decoded.userId; // numeric user id from token
    let userOrders;

    // Filter orders based on user role
    if (decoded.role === "ADMIN") {
      // Admins see ALL orders
      userOrders = mockStore.orders;
    } else if (decoded.role === "SELLER") {
      // Sellers see orders for books THEY listed
      userOrders = mockStore.orders.filter((order) => order.sellerId === userId);
    } else {
      // Buyers see orders THEY placed
  userOrders = mockStore.orders.filter((order) => order.userId === userId);
    }

    // Format response per contract
    return NextResponse.json(
      {
        userId,
        role: decoded.role,
        orders: userOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve orders" },
      { status: 500 }
    );
  }
}
