/**
 * Centralized Mock Data Store
 *
 * This is the single source of truth for all mock data.
 * When backend is ready, simply set USE_MOCK_API=false and this becomes unused.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface MockUser {
  id: number;
  email: string;
  password: string; // In mock mode, stored in plain text (NEVER do this in production!)
  firstName: string;
  lastName: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  accountStatus: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface MockBook {
  bookId: number;
  bookName: string;
  bookDescription: string;
  bookPrice: number; // in dollars (backend might use cents)
  bookPicture: string; // URL
  sellerId: number; // user id of seller who listed this book
  createdAt: string;
}

export interface MockCartItem {
  itemId: string; // UUID
  inventoryId: string; // UUID
  unitPrice: number; // cents
  qty: number;
  lineSubtotal: number; // cents
}

export interface MockCart {
  cartId: string; // UUID
  userId: string; // UUID (maps to MockUser.id as string)
  items: MockCartItem[];
  subtotal: number; // cents
  createdAt: string; // ISO-8601
}

export interface MockOrder {
  orderId: string; // UUID
  userId: number; // user id (buyer)
  sellerId: number; // seller id (maps to MockUser.id)
  cartId: string; // UUID
  itemCount: number;
  total: number; // dollars
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  placedAt: string; // ISO-8601
  shippingAddress: string;
  billingAddress: string;
}

export interface MockReview {
  id: string; // UUID
  bookId: string; // UUID (maps to bookId)
  userId: number; // user id (maps to MockUser.id)
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO-8601 with offset
}

// ============================================================================
// IN-MEMORY STORE
// ============================================================================

class MockDataStore {
  // Users
  users: MockUser[] = [
    {
      id: 1,
      email: "buyer@test.com",
      password: "password123",
      firstName: "John",
      lastName: "Buyer",
      role: "BUYER",
      accountStatus: "ACTIVE",
      createdAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 2,
      email: "seller@test.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Seller",
      role: "SELLER",
      accountStatus: "ACTIVE",
      createdAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 3,
      email: "admin@test.com",
      password: "password123",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      accountStatus: "ACTIVE",
      createdAt: "2025-01-01T00:00:00Z",
    },
  ];

  // Books
  books: MockBook[] = [
    {
      bookId: 1,
      bookName: "The Rizzonomicon",
      bookDescription: "How to Up Your Game and NPC-Proof Your Life",
      bookPrice: 24.99,
      bookPicture:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      sellerId: 2, // seller@test.com
      createdAt: "2025-01-15T10:00:00Z",
    },
    {
      bookId: 2,
      bookName: "Gaslight, Gatekeep, Girlboss",
      bookDescription: "A Modern Guide to Corporate Domination",
      bookPrice: 19.99,
      bookPicture:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      sellerId: 2, // seller@test.com
      createdAt: "2025-01-16T10:00:00Z",
    },
    {
      bookId: 3,
      bookName: "Touch Grass: A Memoir",
      bookDescription: "One Developer's Journey to the Outdoors",
      bookPrice: 14.99,
      bookPicture:
        "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=600&fit=crop",
      sellerId: 2, // seller@test.com
      createdAt: "2025-01-17T10:00:00Z",
    },
  ];

  // Carts (keyed by userId stringified)
  carts: Map<string, MockCart> = new Map();

  // Orders
  orders: MockOrder[] = [
    // Sample order placed by buyer (user id 1)
    {
      orderId: this.generateUUID(),
      userId: 1,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 2,
      total: 44.98,
      status: "Processing",
      placedAt: new Date().toISOString(),
      shippingAddress: "123 Mockingbird Lane",
      billingAddress: "123 Mockingbird Lane",
    },
    // Sample order for seller (user id 2)
    {
      orderId: this.generateUUID(),
      userId: 1,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 1,
      total: 19.99,
      status: "Shipped",
      placedAt: new Date().toISOString(),
      shippingAddress: "456 Example Ave",
      billingAddress: "456 Example Ave",
    },
    // Additional orders for testing
    {
      orderId: this.generateUUID(),
      userId: 1,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 1,
      total: 24.99,
      status: "Processing",
      placedAt: "2025-02-15T10:10:00Z",
      shippingAddress: "12 New St",
      billingAddress: "12 New St",
    },
    {
      orderId: this.generateUUID(),
      userId: 2,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 2,
      total: 39.98,
      status: "Shipped",
      placedAt: "2025-02-16T11:11:00Z",
      shippingAddress: "34 Another Rd",
      billingAddress: "34 Another Rd",
    },
    {
      orderId: this.generateUUID(),
      userId: 1,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 5,
      total: 124.95,
      status: "Delivered",
      placedAt: "2025-02-01T08:00:00Z",
      shippingAddress: "78 Delivery Ln",
      billingAddress: "78 Delivery Ln",
    },
    {
      orderId: this.generateUUID(),
      userId: 3,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 1,
      total: 9.99,
      status: "Cancelled",
      placedAt: "2025-02-18T09:00:00Z",
      shippingAddress: "99 Cancel Blvd",
      billingAddress: "99 Cancel Blvd",
    },
    {
      orderId: this.generateUUID(),
      userId: 2,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 3,
      total: 59.97,
      status: "Processing",
      placedAt: "2025-02-19T12:30:00Z",
      shippingAddress: "321 Market St",
      billingAddress: "321 Market St",
    },
    {
      orderId: this.generateUUID(),
      userId: 1,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 2,
      total: 29.98,
      status: "Shipped",
      placedAt: "2025-02-20T14:45:00Z",
      shippingAddress: "555 Ship Ave",
      billingAddress: "555 Ship Ave",
    },
    {
      orderId: this.generateUUID(),
      userId: 3,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 6,
      total: 179.94,
      status: "Delivered",
      placedAt: "2025-02-21T16:00:00Z",
      shippingAddress: "777 Long Rd",
      billingAddress: "777 Long Rd",
    },
    {
      orderId: this.generateUUID(),
      userId: 2,
      sellerId: 2,
      cartId: this.generateUUID(),
      itemCount: 1,
      total: 7.99,
      status: "Processing",
      placedAt: "2025-02-22T10:00:00Z",
      shippingAddress: "111 Quick St",
      billingAddress: "111 Quick St",
    },
  ];

  // Reviews
  reviews: MockReview[] = [];

  // Auto-increment IDs
  private nextUserId = 4;
  private nextBookId = 4;
  private nextOrderNumber = 1;

  // UUID generator for mock data
  generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Convert book ID to UUID format for inventory system
  bookIdToUUID(bookId: number): string {
    return `00000000-0000-0000-0000-${String(bookId).padStart(12, "0")}`;
  }

  // Get or create cart for user (accepts number or string userId)
  getOrCreateCart(userId: number | string): MockCart {
    const key = String(userId);
    if (!this.carts.has(key)) {
      this.carts.set(key, {
        cartId: this.generateUUID(),
        userId: key,
        items: [],
        subtotal: 0,
        createdAt: new Date().toISOString(),
      });
    }
    return this.carts.get(key)!;
  }

  // Update cart subtotal
  updateCartSubtotal(cart: MockCart): void {
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.lineSubtotal,
      0
    );
  }

  // Get next user ID
  getNextUserId(): number {
    return this.nextUserId++;
  }

  // Get next book ID
  getNextBookId(): number {
    return this.nextBookId++;
  }

  // Get next order number
  getNextOrderNumber(): number {
    return this.nextOrderNumber++;
  }

  // Reset store (useful for testing)
  reset(): void {
    this.users = this.users.slice(0, 3); // Keep default users
    this.books = this.books.slice(0, 3); // Keep default books
    this.carts.clear();
    this.orders = [];
    this.reviews = [];
    this.nextUserId = 4;
    this.nextBookId = 4;
    this.nextOrderNumber = 1;
  }
}

// Export singleton instance
export const mockStore = new MockDataStore();
