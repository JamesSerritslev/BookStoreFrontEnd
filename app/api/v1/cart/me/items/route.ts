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
 * POST /api/v1/cart/me/items
 * Add item to cart
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

    const body = await request.json();
    const { inventoryId, qty } = body;

    // Validation
    if (!inventoryId || qty === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_FAILED",
            message: "Missing required fields",
            details: { inventoryId: "required", qty: "required" },
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

  const userId = decoded.userId;
  const cart = mockStore.getOrCreateCart(String(userId));

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.inventoryId === inventoryId
    );

    if (existingItem) {
      // Update quantity
      existingItem.qty += qty;
      existingItem.lineSubtotal = existingItem.unitPrice * existingItem.qty;
    } else {
      // Add new item (generate random price for mock data)
      const newItem = {
        itemId: mockStore.generateUUID(),
        inventoryId,
        unitPrice: Math.floor(Math.random() * 5000) + 1000, // Random price 10-60 dollars in cents
        qty,
        lineSubtotal: 0,
      };
      newItem.lineSubtotal = newItem.unitPrice * newItem.qty;
      cart.items.push(newItem);
    }

    mockStore.updateCartSubtotal(cart);

    return NextResponse.json(
      {
        success: true,
        message: "Item added",
        data: {
          itemId:
            existingItem?.itemId || cart.items[cart.items.length - 1].itemId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to add item to cart",
        },
      },
      { status: 500 }
    );
  }
}
