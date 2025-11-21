// Cart API Type Definitions
// Based on Cart API Contract

export interface CartItem {
  itemId: string; // UUID
  inventoryId: string; // UUID
  unitPrice: number; // Price in cents
  qty: number;
  lineSubtotal: number; // Price in cents
}

export interface CartResponse {
  cartId: string; // UUID
  userId: string; // UUID
  items: CartItemWithDetails[];
  subtotal: number; // Price in cents
  createdAt: string; // ISO-8601 UTC timestamp
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AddCartItemRequest {
  inventoryId: string; // UUID
  qty: number;
}

export interface UpdateCartItemRequest {
  qty: number;
}

export interface AddCartItemResponse {
  itemId: string; // UUID
}

// Helper type for cart with book details (for display)
export interface CartItemWithDetails extends CartItem {
  bookName?: string;
  bookPicture?: string;
  bookDescription?: string;
}

export interface CartResponseWithDetails {
  cartId: string;
  userId: string;
  items: CartItemWithDetails[];
  subtotal: number;
  createdAt: string;
}
