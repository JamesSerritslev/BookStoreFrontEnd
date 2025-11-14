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
 * PATCH /api/v1/cart/me/items/{itemId}
 * Update cart item quantity
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
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

    const body = await request.json();
    const { qty } = body;

    // Validation
    if (qty === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_FAILED",
            message: "Missing required field",
            details: { qty: "required" },
          },
        },
        { status: 400 }
      );
    }

    if (qty < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_FAILED",
            message: "Invalid quantity",
            details: { qty: "must be greater than or equal to 1" },
          },
        },
        { status: 400 }
      );
    }

    const userId = mockStore.userIdToUUID(decoded.userId);
    const cart = mockStore.getOrCreateCart(userId);

    // Find item
    const item = cart.items.find((i) => i.itemId === params.itemId);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found",
          error: {
            code: "CART_ITEM_NOT_FOUND",
            message: "Item not found in cart",
          },
        },
        { status: 404 }
      );
    }

    // Update quantity
    item.qty = qty;
    item.lineSubtotal = item.unitPrice * item.qty;
    mockStore.updateCartSubtotal(cart);

    return NextResponse.json(
      {
        success: true,
        message: "Item updated",
        data: cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update cart item error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL_ERROR", message: "Failed to update item" },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/cart/me/items/{itemId}
 * Remove item from cart
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
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

    const userId = mockStore.userIdToUUID(decoded.userId);
    const cart = mockStore.getOrCreateCart(userId);

    // Find and remove item
    const itemIndex = cart.items.findIndex((i) => i.itemId === params.itemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found",
          error: {
            code: "CART_ITEM_NOT_FOUND",
            message: "Item not found in cart",
          },
        },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);
    mockStore.updateCartSubtotal(cart);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: { code: "INTERNAL_ERROR", message: "Failed to delete item" },
      },
      { status: 500 }
    );
  }
}
