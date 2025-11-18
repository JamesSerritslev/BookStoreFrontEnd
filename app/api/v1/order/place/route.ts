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
 * POST /api/v1/order/place
 * Place a new order
 */
export async function POST(request: NextRequest) {
  try {
    const decoded = decodeToken(request);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cartId, itemCount, total, shippingAddress, billingAddress } = body;

    // Validation
    if (
      !cartId ||
      !itemCount ||
      total === undefined ||
      !shippingAddress ||
      !billingAddress
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

  const userId = decoded.userId;

  // Get cart to determine seller from items (carts are keyed by stringified user id)
  const cart = mockStore.carts.get(String(userId));
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Get the first item's inventory/book to determine seller
    // Note: In a real marketplace, you'd validate all items are from same seller
    // or create separate orders per seller
    const firstInventoryId = cart.items[0].inventoryId;

    // Find the book by matching inventoryId (which is derived from bookId)
    // Extract bookId from inventoryId format: "00000000-0000-0000-0000-000000000001"
    const bookIdFromInventory = parseInt(
      firstInventoryId.split("-").pop() || "0"
    );
    const book = mockStore.books.find((b) => b.bookId === bookIdFromInventory);

    if (!book) {
      return NextResponse.json(
        { error: "Book not found in inventory" },
        { status: 404 }
      );
    }

    // Create new order with seller tracking
    const newOrder = {
      orderId: mockStore.generateUUID(),
      userId,
      sellerId: book.sellerId, // Track which seller gets this order (numeric)
      cartId,
      itemCount,
      total: Number(total),
      status: "Processing" as const,
      placedAt: new Date().toISOString(),
      shippingAddress,
      billingAddress,
    };

    mockStore.orders.push(newOrder);

    // Clear user's cart after placing order
    cart.items = [];
    cart.subtotal = 0;

    return NextResponse.json(
      { message: "Success! The order is being placed." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Place order error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
