// Cart API Service
// Handles all cart-related API calls
// MSW (Mock Service Worker) intercepts these calls in development mode

import {
  CartResponse,
  ApiResponse,
  AddCartItemRequest,
  UpdateCartItemRequest,
  AddCartItemResponse,
} from "@/lib/types/cart";
import { getApiUrl, getApiHeaders } from "@/lib/config";

/**
 * Get current user's cart
 */
export async function getCart(): Promise<CartResponse> {
  const response = await fetch(getApiUrl("/api/v1/cart/me"), {
    method: "GET",
    headers: getApiHeaders(),
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
  const requestBody: AddCartItemRequest = {
    inventoryId,
    qty,
  };

  const response = await fetch(getApiUrl("/api/v1/cart/me/items"), {
    method: "POST",
    headers: getApiHeaders(),
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
  const requestBody: UpdateCartItemRequest = { qty };

  const response = await fetch(getApiUrl(`/api/v1/cart/me/items/${itemId}`), {
    method: "PATCH",
    headers: getApiHeaders(),
    body: JSON.stringify(requestBody),
  });

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
  const response = await fetch(getApiUrl(`/api/v1/cart/me/items/${itemId}`), {
    method: "DELETE",
    headers: getApiHeaders(),
  });

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
  const response = await fetch(getApiUrl("/api/v1/cart/me/clear"), {
    method: "POST",
    headers: getApiHeaders(),
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
