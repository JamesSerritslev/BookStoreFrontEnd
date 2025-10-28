// Cart API Service
// Handles all cart-related API calls

import {
  CartResponse,
  ApiResponse,
  AddCartItemRequest,
  UpdateCartItemRequest,
  AddCartItemResponse,
} from "@/lib/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 🎭 MOCK MODE - Set to true to use mock data without backend
// Set to false when backend is ready
const USE_MOCK_MODE = true;

// Mock cart storage (in-memory, resets on page refresh)
let mockCart: CartResponse = {
  cartId: "mock-cart-00000000-0000-0000-0000-000000000001",
  userId: "mock-user-00000000-0000-0000-0000-000000000001",
  items: [],
  subtotal: 0,
  createdAt: new Date().toISOString(),
};

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Helper function to create headers
function getHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Get current user's cart
 */
export async function getCart(): Promise<CartResponse> {
  // 🎭 MOCK MODE
  if (USE_MOCK_MODE) {
    console.log("🎭 Mock Mode: Fetching cart...");
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    return { ...mockCart };
  }

  // Real API call
  const response = await fetch(`${API_BASE_URL}/api/v1/cart/me`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - Please log in");
    }
    throw new Error("Failed to fetch cart");
  }

  const apiResponse: ApiResponse<CartResponse> = await response.json();

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || "Failed to fetch cart");
  }

  return apiResponse.data;
}

/**
 * Add item to cart
 */
export async function addToCart(
  inventoryId: string,
  qty: number = 1
): Promise<AddCartItemResponse> {
  // 🎭 MOCK MODE
  if (USE_MOCK_MODE) {
    console.log(
      `🎭 Mock Mode: Adding item ${inventoryId} (qty: ${qty}) to cart...`
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    // Check if item already exists
    const existingItem = mockCart.items.find(
      (item) => item.inventoryId === inventoryId
    );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.qty += qty;
      existingItem.lineSubtotal = existingItem.unitPrice * existingItem.qty;
    } else {
      // Add new item (using dummy price for demo)
      const newItemId = `mock-item-${Date.now()}`;
      const unitPrice = Math.floor(Math.random() * 5000) + 1000; // Random price between $10-$60

      mockCart.items.push({
        itemId: newItemId,
        inventoryId,
        unitPrice,
        qty,
        lineSubtotal: unitPrice * qty,
      });
    }

    // Recalculate subtotal
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.lineSubtotal,
      0
    );

    const itemId =
      existingItem?.itemId || mockCart.items[mockCart.items.length - 1].itemId;
    console.log(
      `✅ Mock Mode: Item added! Cart now has ${mockCart.items.length} item(s)`
    );

    return { itemId };
  }

  // Real API call
  const requestBody: AddCartItemRequest = {
    inventoryId,
    qty,
  };

  const response = await fetch(`${API_BASE_URL}/api/v1/cart/me/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      throw new Error("Unauthorized - Please log in");
    }
    if (response.status === 404) {
      throw new Error("Item not found");
    }
    if (response.status === 422) {
      throw new Error("Quantity exceeds available stock");
    }

    throw new Error(errorData.message || "Failed to add item to cart");
  }

  const apiResponse: ApiResponse<AddCartItemResponse> = await response.json();

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || "Failed to add item to cart");
  }

  return apiResponse.data;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  itemId: string,
  qty: number
): Promise<CartResponse> {
  // 🎭 MOCK MODE
  if (USE_MOCK_MODE) {
    console.log(`🎭 Mock Mode: Updating item ${itemId} quantity to ${qty}...`);
    await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay

    const item = mockCart.items.find((item) => item.itemId === itemId);

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (qty < 1) {
      throw new Error("Quantity must be at least 1");
    }

    item.qty = qty;
    item.lineSubtotal = item.unitPrice * qty;

    // Recalculate subtotal
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.lineSubtotal,
      0
    );

    console.log(`✅ Mock Mode: Item updated! New quantity: ${qty}`);
    return { ...mockCart };
  }

  // Real API call
  const requestBody: UpdateCartItemRequest = { qty };

  const response = await fetch(
    `${API_BASE_URL}/api/v1/cart/me/items/${itemId}`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      throw new Error("Unauthorized - Please log in");
    }
    if (response.status === 404) {
      throw new Error("Cart item not found");
    }

    throw new Error(errorData.message || "Failed to update cart item");
  }

  const apiResponse: ApiResponse<CartResponse> = await response.json();

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || "Failed to update cart item");
  }

  return apiResponse.data;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string): Promise<void> {
  // 🎭 MOCK MODE
  if (USE_MOCK_MODE) {
    console.log(`🎭 Mock Mode: Removing item ${itemId} from cart...`);
    await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay

    const itemIndex = mockCart.items.findIndex(
      (item) => item.itemId === itemId
    );

    if (itemIndex === -1) {
      throw new Error("Cart item not found");
    }

    mockCart.items.splice(itemIndex, 1);

    // Recalculate subtotal
    mockCart.subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.lineSubtotal,
      0
    );

    console.log(
      `✅ Mock Mode: Item removed! Cart now has ${mockCart.items.length} item(s)`
    );
    return;
  }

  // Real API call
  const response = await fetch(
    `${API_BASE_URL}/api/v1/cart/me/items/${itemId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - Please log in");
    }
    if (response.status === 404) {
      throw new Error("Cart item not found");
    }

    throw new Error("Failed to remove item from cart");
  }

  // 204 No Content - success
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
  // 🎭 MOCK MODE
  if (USE_MOCK_MODE) {
    console.log("🎭 Mock Mode: Clearing entire cart...");
    await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay

    mockCart.items = [];
    mockCart.subtotal = 0;

    console.log("✅ Mock Mode: Cart cleared!");
    return;
  }

  // Real API call
  const response = await fetch(`${API_BASE_URL}/api/v1/cart/me/clear`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - Please log in");
    }

    throw new Error("Failed to clear cart");
  }

  // 204 No Content - success
}

/**
 * Utility function to convert cents to dollars for display
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Utility function to format price for display
 */
export function formatPrice(cents: number): string {
  return `$${centsToDollars(cents).toFixed(2)}`;
}
