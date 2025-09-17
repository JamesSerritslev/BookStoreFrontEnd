// lib/api.ts
// chatGPT wrote this I hope it works because I have no idea how this stuff works.

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const USE_MOCK_DATA: boolean = process.env.NEXT_PUBLIC_API_MOCK === "1";

// ---------- small types ----------
type HttpMethod = "GET" | "POST" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  authToken?: string;
  jsonBody?: unknown;
}

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  role: string; // "customer" | "admin" (kept simple)
}

interface ApiBook {
  bookId: number;
  bookName: string;
  bookDescription: string;
  bookPrice: number;
  bookPicture: string; // URL
}

interface ApiCartItem {
  itemId: string;
  bookId: string;
  qty: number;
}

interface ApiCart {
  cartId: string;
  userId: string;
  items: ApiCartItem[];
}

interface ApiReview {
  id: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO
}

interface ApiOrder {
  userId: string;
  cartId: string;
  itemCount: number;
  total: number;
  status: string;
  placedAt: string; // ISO
  shippingAddress: string;
  billingAddress: string;
}

// ---------- tiny helpers ----------
async function requestJson<T>(endpointPath: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", authToken, jsonBody } = options;
  const url = buildAbsoluteUrl(API_BASE_URL, endpointPath);

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(jsonBody ? { "Content-Type": "application/json" } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    ...(jsonBody ? { body: JSON.stringify(jsonBody) } : {}),
  });

  const text = await response.text();
  const parsed = safeParseJson(text);
  if (!response.ok) {
    const message = (parsed && (parsed as any).error) || (parsed as any)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return parsed as T;
}

function safeParseJson(text: string): unknown {
  try { return text ? JSON.parse(text) : null; } catch { return null; }
}

function buildAbsoluteUrl(base: string, path: string): string {
  if (!base) return path;
  if (path.startsWith("http")) return path;
  if (!base.endsWith("/") && !path.startsWith("/")) return `${base}/${path}`;
  if (base.endsWith("/") && path.startsWith("/")) return base + path.slice(1);
  return base + path;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2);
}

// ---------- in-memory “database” (typed to avoid never[] issues) ----------
const mockDb: {
  users: ApiUser[];
  books: ApiBook[];
  cart: ApiCart;
  reviews: ApiReview[];
  orders: ApiOrder[];
} = {
  users: [
    {
      id: 1,
      firstName: "Alice",
      lastName: "Johnson",
      address: "123 Main St, NY,12345",
      email: "alice@example.com",
      phone: "+1-555-1234",
      role: "customer",
    },
  ],
  books: [
    {
      bookId: 1,
      bookName: "Example Book",
      bookDescription: "A great read.",
      bookPrice: 19.99,
      bookPicture: "https://picsum.photos/seed/book/400/600",
    },
  ],
  cart: {
    cartId: newId(),
    userId: newId(),
    items: [],
  },
  reviews: [
    {
      id: newId(),
      bookId: "11111111-1111-1111-1111-111111111111",
      rating: 5,
      comment: "Loved it!",
      createdAt: new Date().toISOString(),
    },
  ],
  orders: [],
};

// ======================= USERS =======================
// GET /api/v1/user
export async function fetchAllUsers(authToken?: string): Promise<ApiUser[]> {
  if (USE_MOCK_DATA) return [...mockDb.users];
  return requestJson<ApiUser[]>("/api/v1/user", { authToken });
}

// POST /api/v1/user
export async function createNewUser(newUser: Omit<ApiUser, "id">, authToken?: string): Promise<ApiUser> {
  if (USE_MOCK_DATA) {
    const newIdNum = mockDb.users.length ? Math.max(...mockDb.users.map(u => u.id)) + 1 : 1;
    const user: ApiUser = { id: newIdNum, ...newUser };
    mockDb.users.push(user);
    return user;
  }
  return requestJson<ApiUser>("/api/v1/user", { method: "POST", jsonBody: newUser, authToken });
}

// DELETE /api/v1/user/:id
export async function deleteUserById(userId: number, authToken?: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.users.findIndex(u => u.id === userId);
    if (i === -1) throw new Error(`User with id ${userId} not found`);
    mockDb.users.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/user/${userId}`, { method: "DELETE", authToken });
}

// ======================= BOOKS =======================
// GET /api/v1/book
export async function fetchAllBooks(): Promise<ApiBook[]> {
  if (USE_MOCK_DATA) return [...mockDb.books];
  return requestJson<ApiBook[]>("/api/v1/book");
}

// POST /api/v1/book
export async function createNewBook(book: Omit<ApiBook, "bookId">, authToken?: string): Promise<ApiBook> {
  if (USE_MOCK_DATA) {
    const id = mockDb.books.length ? Math.max(...mockDb.books.map(b => b.bookId)) + 1 : 1;
    const created: ApiBook = { bookId: id, ...book };
    mockDb.books.push(created);
    return created;
  }
  return requestJson<ApiBook>("/api/v1/book", { method: "POST", jsonBody: book, authToken });
}

// DELETE /api/v1/book/:bookid
export async function removeBookById(bookId: number, authToken?: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.books.findIndex(b => b.bookId === bookId);
    if (i === -1) throw new Error("Book not found");
    mockDb.books.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/book/${bookId}`, { method: "DELETE", authToken });
}

// ======================= CART =======================
// GET /api/v1/cart
export async function fetchCurrentCart(authToken?: string): Promise<ApiCart> {
  if (USE_MOCK_DATA) {
    return { ...mockDb.cart, items: mockDb.cart.items.map(i => ({ ...i })) };
  }
  return requestJson<ApiCart>("/api/v1/cart", { authToken });
}

// POST /api/v1/cart  (add item)
export async function addItemToCart(args: { bookId: string; qty: number }, authToken?: string): Promise<{ itemId: string }> {
  const { bookId, qty } = args;
  if (USE_MOCK_DATA) {
    if (!bookId || qty < 1) throw new Error("Invalid request");
    const existing = mockDb.cart.items.find(i => i.bookId === bookId);
    if (existing) {
      existing.qty += qty;
      return { itemId: existing.itemId };
    }
    const item: ApiCartItem = { itemId: newId(), bookId, qty };
    mockDb.cart.items.push(item);
    return { itemId: item.itemId };
  }
  return requestJson<{ itemId: string }>("/api/v1/cart", { method: "POST", jsonBody: { bookId, qty }, authToken });
}

// DELETE /api/v1/cart?itemId=...
export async function removeItemFromCart(itemId: string, authToken?: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.cart.items.findIndex(i => i.itemId === itemId);
    if (i === -1) throw new Error("Cart item not found");
    mockDb.cart.items.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/cart?itemId=${encodeURIComponent(itemId)}`, { method: "DELETE", authToken });
}

// ======================= REVIEWS =======================
// GET /api/v1/review?id=<bookId>&page&size
export async function fetchReviewsForBook(bookId: string, page: number = 0, size: number = 10): Promise<{
  bookId: string; page: number; size: number; total: number; items: ApiReview[];
}> {
  if (USE_MOCK_DATA) {
    const all = mockDb.reviews.filter(r => r.bookId === bookId);
    const items = all.slice(page * size, page * size + size).map(r => ({ ...r }));
    return { bookId, page, size, total: all.length, items };
  }
  const qs = new URLSearchParams({ id: bookId, page: String(page), size: String(size) });
  return requestJson(`/api/v1/review?${qs.toString()}`);
}

// POST /api/v1/review
export async function createNewReviewForBook(
  args: { bookId: string; rating: number; comment: string },
  authToken?: string
): Promise<{ id: string }> {
  const { bookId, rating, comment } = args;
  if (USE_MOCK_DATA) {
    if (!bookId || rating < 1 || rating > 5 || !comment) throw new Error("Invalid request");
    const id = newId();
    mockDb.reviews.push({ id, bookId, rating, comment, createdAt: new Date().toISOString() });
    return { id };
  }
  return requestJson<{ id: string }>("/api/v1/review", { method: "POST", jsonBody: { bookId, rating, comment }, authToken });
}

// DELETE /api/v1/review?id=<reviewId>
export async function deleteReviewById(reviewId: string, authToken?: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.reviews.findIndex(r => r.id === reviewId);
    if (i === -1) throw new Error("Review not found");
    mockDb.reviews.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/review?id=${encodeURIComponent(reviewId)}`, { method: "DELETE", authToken });
}

// ======================= ORDERS (minimal) =======================
// POST /api/v1/order
export async function submitOrder(
  args: { userId: string; cartId: string; shippingAddress: string; billingAddress: string },
  authToken?: string
): Promise<ApiOrder> {
  const { userId, cartId, shippingAddress, billingAddress } = args;
  if (USE_MOCK_DATA) {
    const order: ApiOrder = {
      userId,
      cartId,
      itemCount: mockDb.cart.items.reduce((n, i) => n + i.qty, 0),
      total: mockDb.cart.items.reduce((sum, i) => {
        const b = mockDb.books.find(bk => String(bk.bookId) === String(i.bookId));
        return sum + (b ? b.bookPrice * i.qty : 0);
      }, 0),
      status: "PLACED",
      placedAt: new Date().toISOString(),
      shippingAddress,
      billingAddress,
    };
    mockDb.orders.push(order);
    return order;
  }
  return requestJson<ApiOrder>("/api/v1/order", { method: "POST", jsonBody: args, authToken });
}

// GET /api/v1/order?userId=...
export async function fetchOrdersForUser(userId: string, authToken?: string): Promise<ApiOrder[]> {
  if (USE_MOCK_DATA) return mockDb.orders.filter(o => o.userId === userId).map(o => ({ ...o }));
  return requestJson<ApiOrder[]>(`/api/v1/order?userId=${encodeURIComponent(userId)}`, { authToken });
}

/*
Usage example
import {
  fetchAllBooks, createNewBook, removeBookById,
  fetchAllUsers, createNewUser, deleteUserById,
  fetchCurrentCart, addItemToCart, removeItemFromCart,
  fetchReviewsForBook, createNewReviewForBook, deleteReviewById,
  submitOrder, fetchOrdersForUser
} from "@/lib/api";

const books = await fetchAllBooks();
await addItemToCart({ bookId: "1", qty: 2 });
const cart = await fetchCurrentCart();
*/