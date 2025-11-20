// lib/api.ts

// ========== 🔐 Centralized Token Storage ==========
const AUTH_TOKEN_KEY = "authToken";

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function getAuthToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
}

// ========== ⚙️ API Setup ==========
const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const USE_MOCK_DATA: boolean = process.env.NEXT_PUBLIC_API_MOCK === "1";

type HttpMethod = "GET" | "POST" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  jsonBody?: unknown;
}

// ========== 📦 Data Types ==========
interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  role: string;
}

export interface ApiBook {
  bookId: number;
  bookName: string;
  bookDescription: string;
  bookPrice: number;
  bookPicture: string;
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
  createdAt: string;
}

interface ApiOrder {
  userId: string;
  cartId: string;
  itemCount: number;
  total: number;
  status: string;
  placedAt: string;
  shippingAddress: string;
  billingAddress: string;
}

// ========== 🧠 Helper Functions ==========

function buildAbsoluteUrl(base: string, path: string): string {
  if (!base) return path;
  if (path.startsWith("http")) return path;
  if (!base.endsWith("/") && !path.startsWith("/")) return `${base}/${path}`;
  if (base.endsWith("/") && path.startsWith("/")) return base + path.slice(1);
  return base + path;
}

function safeParseJson(text: string): unknown {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2);
}

// ========== 🔗 Request Wrapper ==========

async function requestJson<T>(endpointPath: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", jsonBody } = options;
  const url = buildAbsoluteUrl(API_BASE_URL, endpointPath);
  const authToken = getAuthToken();

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (jsonBody) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    ...(jsonBody ? { body: JSON.stringify(jsonBody) } : {}),
  });

  const text = await response.text();
  const parsed = safeParseJson(text);
  if (!response.ok) {
    const message =
      (parsed && (parsed as any).error) ||
      (parsed as any)?.message ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return parsed as T;
}

// ========== 🧪 In-Memory Mock DB ==========
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

// ========== API Functions ==========

// USERS
export async function fetchAllUsers(): Promise<ApiUser[]> {
  if (USE_MOCK_DATA) return [...mockDb.users];
  return requestJson<ApiUser[]>("/api/v1/user");
}

export async function createNewUser(newUser: Omit<ApiUser, "id">): Promise<ApiUser> {
  if (USE_MOCK_DATA) {
    const newIdNum = mockDb.users.length ? Math.max(...mockDb.users.map(u => u.id)) + 1 : 1;
    const user: ApiUser = { id: newIdNum, ...newUser };
    mockDb.users.push(user);
    return user;
  }
  return requestJson<ApiUser>("/api/v1/user", { method: "POST", jsonBody: newUser });
}

export async function deleteUserById(userId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.users.findIndex(u => u.id === userId);
    if (i === -1) throw new Error(`User with id ${userId} not found`);
    mockDb.users.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/user/${userId}`, { method: "DELETE" });
}

// BOOKS
export async function fetchAllBooks(): Promise<ApiBook[]> {
  if (USE_MOCK_DATA) return [...mockDb.books];
  return requestJson<ApiBook[]>("/api/v1/book");
}

export async function createNewBook(book: Omit<ApiBook, "bookId">): Promise<ApiBook> {
  if (USE_MOCK_DATA) {
    const id = mockDb.books.length ? Math.max(...mockDb.books.map(b => b.bookId)) + 1 : 1;
    const created: ApiBook = { bookId: id, ...book };
    mockDb.books.push(created);
    return created;
  }
  return requestJson<ApiBook>("/api/v1/book", { method: "POST", jsonBody: book });
}

export async function updateBookById(bookId: number, book: Partial<Omit<ApiBook, "bookId">>): Promise<ApiBook> {
  if (USE_MOCK_DATA) {
    const i = mockDb.books.findIndex(b => b.bookId === bookId);
    if (i === -1) throw new Error("Book not found");
    mockDb.books[i] = { ...mockDb.books[i], ...book };
    return mockDb.books[i];
  }
  return requestJson<ApiBook>(`/api/v1/book/${bookId}`, { method: "PUT", jsonBody: book });
}

export async function removeBookById(bookId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.books.findIndex(b => b.bookId === bookId);
    if (i === -1) throw new Error("Book not found");
    mockDb.books.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/book/${bookId}`, { method: "DELETE" });
}

// CART
export async function fetchCurrentCart(): Promise<ApiCart> {
  if (USE_MOCK_DATA) return { ...mockDb.cart, items: [...mockDb.cart.items] };
  return requestJson<ApiCart>("/api/v1/cart");
}

export async function addItemToCart(args: { bookId: string; qty: number }): Promise<{ itemId: string }> {
  if (USE_MOCK_DATA) {
    const { bookId, qty } = args;
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
  return requestJson<{ itemId: string }>("/api/v1/cart", { method: "POST", jsonBody: args });
}

export async function removeItemFromCart(itemId: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.cart.items.findIndex(i => i.itemId === itemId);
    if (i === -1) throw new Error("Cart item not found");
    mockDb.cart.items.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/cart?itemId=${encodeURIComponent(itemId)}`, { method: "DELETE" });
}

// REVIEWS
export async function fetchReviewsForBook(bookId: string, page = 0, size = 10): Promise<{
  bookId: string;
  page: number;
  size: number;
  total: number;
  items: ApiReview[];
}> {
  if (USE_MOCK_DATA) {
    const all = mockDb.reviews.filter(r => r.bookId === bookId);
    const items = all.slice(page * size, page * size + size);
    return { bookId, page, size, total: all.length, items };
  }
  const qs = new URLSearchParams({ id: bookId, page: String(page), size: String(size) });
  return requestJson(`/api/v1/review?${qs.toString()}`);
}

export async function createNewReviewForBook(args: { bookId: string; rating: number; comment: string }): Promise<{ id: string }> {
  if (USE_MOCK_DATA) {
    const { bookId, rating, comment } = args;
    if (!bookId || rating < 1 || rating > 5 || !comment) throw new Error("Invalid request");
    const id = newId();
    mockDb.reviews.push({ id, bookId, rating, comment, createdAt: new Date().toISOString() });
    return { id };
  }
  return requestJson<{ id: string }>("/api/v1/review", { method: "POST", jsonBody: args });
}

export async function deleteReviewById(reviewId: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const i = mockDb.reviews.findIndex(r => r.id === reviewId);
    if (i === -1) throw new Error("Review not found");
    mockDb.reviews.splice(i, 1);
    return;
  }
  await requestJson<void>(`/api/v1/review?id=${encodeURIComponent(reviewId)}`, { method: "DELETE" });
}

// ORDERS
export async function submitOrder(args: {
  userId: string;
  cartId: string;
  shippingAddress: string;
  billingAddress: string;
}): Promise<ApiOrder> {
  if (USE_MOCK_DATA) {
    const order: ApiOrder = {
      userId: args.userId,
      cartId: args.cartId,
      itemCount: mockDb.cart.items.reduce((n, i) => n + i.qty, 0),
      total: mockDb.cart.items.reduce((sum, i) => {
        const b = mockDb.books.find(bk => String(bk.bookId) === String(i.bookId));
        return sum + (b ? b.bookPrice * i.qty : 0);
      }, 0),
      status: "PLACED",
      placedAt: new Date().toISOString(),
      shippingAddress: args.shippingAddress,
      billingAddress: args.billingAddress,
    };
    mockDb.orders.push(order);
    return order;
  }
  return requestJson<ApiOrder>("/api/v1/order", { method: "POST", jsonBody: args });
}

export async function fetchOrdersForUser(userId: string): Promise<ApiOrder[]> {
  if (USE_MOCK_DATA) return mockDb.orders.filter(o => o.userId === userId).map(o => ({ ...o }));
  return requestJson<ApiOrder[]>(`/api/v1/order?userId=${encodeURIComponent(userId)}`);
}