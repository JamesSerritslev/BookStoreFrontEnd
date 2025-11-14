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
  sellerId: string; // UUID of seller who listed this book
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
  userId: string; // UUID (buyer)
  sellerId: string; // UUID (seller who listed the books)
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
  userId: string; // UUID (maps to user id)
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
      sellerId: "00000000-0000-0000-0000-000000000002", // seller@test.com
      createdAt: "2025-01-15T10:00:00Z",
    },
    {
      bookId: 2,
      bookName: "Gaslight, Gatekeep, Girlboss",
      bookDescription: "A Modern Guide to Corporate Domination",
      bookPrice: 19.99,
      bookPicture:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      sellerId: "00000000-0000-0000-0000-000000000002", // seller@test.com
      createdAt: "2025-01-16T10:00:00Z",
    },
    {
      bookId: 3,
      bookName: "Touch Grass: A Memoir",
      bookDescription: "One Developer's Journey to the Outdoors",
      bookPrice: 14.99,
      bookPicture:
        "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=600&fit=crop",
      sellerId: "00000000-0000-0000-0000-000000000002", // seller@test.com
      createdAt: "2025-01-17T10:00:00Z",
    },
  ];

  // Carts (keyed by userId)
  carts: Map<string, MockCart> = new Map();

  // Orders
  orders: MockOrder[] = [];

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

  // Convert user ID to UUID format for cart system
  userIdToUUID(userId: number): string {
    return `00000000-0000-0000-0000-${String(userId).padStart(12, "0")}`;
  }

  // Convert book ID to UUID format for inventory system
  bookIdToUUID(bookId: number): string {
    return `00000000-0000-0000-0000-${String(bookId).padStart(12, "0")}`;
  }

  // Get or create cart for user
  getOrCreateCart(userId: string): MockCart {
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        cartId: this.generateUUID(),
        userId,
        items: [],
        subtotal: 0,
        createdAt: new Date().toISOString(),
      });
    }
    return this.carts.get(userId)!;
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
