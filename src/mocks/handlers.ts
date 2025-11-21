import { http, HttpResponse } from "msw";

// Mock books data that matches your ApiBook interface
const mockBooks = [
  {
    bookId: 1,
    bookName: "The Great Gatsby",
    bookDescription: "A classic American novel about the Jazz Age",
    bookPrice: 12.99,
    bookPicture: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
  },
  {
    bookId: 2,
    bookName: "To Kill a Mockingbird",
    bookDescription: "A gripping tale of racial injustice and childhood innocence",
    bookPrice: 14.99,
    bookPicture: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
  },
  {
    bookId: 3,
    bookName: "1984",
    bookDescription: "A dystopian social science fiction novel",
    bookPrice: 13.99,
    bookPicture: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
  },
];

// Mock orders data - comprehensive list of customer orders
// Orders include customerEmail to match with users
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    total: 25.98,
    createdAt: "2024-01-15T10:30:00Z",
    status: "Completed",
    amount: 25.98,
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    total: 14.99,
    createdAt: "2024-01-16T14:20:00Z",
    status: "Pending",
    amount: 14.99,
    date: "2024-01-16",
  },
  {
    id: "ORD-003",
    customerName: "Bob Johnson",
    customerEmail: "bob.johnson@example.com",
    total: 28.98,
    createdAt: "2024-01-17T09:15:00Z",
    status: "Processing",
    amount: 28.98,
    date: "2024-01-17",
  },
  {
    id: "ORD-004",
    customerName: "Alice Williams",
    customerEmail: "alice.williams@example.com",
    total: 42.97,
    createdAt: "2024-01-18T11:45:00Z",
    status: "Completed",
    amount: 42.97,
    date: "2024-01-18",
  },
  {
    id: "ORD-005",
    customerName: "Charlie Brown",
    customerEmail: "charlie.brown@example.com",
    total: 19.99,
    createdAt: "2024-01-19T16:20:00Z",
    status: "Pending",
    amount: 19.99,
    date: "2024-01-19",
  },
  {
    id: "ORD-006",
    customerName: "Diana Prince",
    customerEmail: "diana.prince@example.com",
    total: 35.96,
    createdAt: "2024-01-20T08:30:00Z",
    status: "Completed",
    amount: 35.96,
    date: "2024-01-20",
  },
  {
    id: "ORD-007",
    customerName: "Edward Norton",
    customerEmail: "edward.norton@example.com",
    total: 12.99,
    createdAt: "2024-01-21T13:10:00Z",
    status: "Processing",
    amount: 12.99,
    date: "2024-01-21",
  },
  {
    id: "ORD-008",
    customerName: "Buyer One",
    customerEmail: "buyer1@bookhub.com",
    total: 55.94,
    createdAt: "2024-01-22T15:00:00Z",
    status: "Completed",
    amount: 55.94,
    date: "2024-01-22",
  },
  {
    id: "ORD-009",
    customerName: "Buyer One",
    customerEmail: "buyer1@bookhub.com",
    total: 27.98,
    createdAt: "2024-01-23T09:25:00Z",
    status: "Pending",
    amount: 27.98,
    date: "2024-01-23",
  },
  {
    id: "ORD-010",
    customerName: "Buyer One",
    customerEmail: "buyer1@bookhub.com",
    total: 33.97,
    createdAt: "2024-01-24T10:50:00Z",
    status: "Completed",
    amount: 33.97,
    date: "2024-01-24",
  },
];

// Mock users data for admin panel
const mockUsers = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@bookhub.com",
    role: "ADMIN",
  },
  {
    id: "user-2",
    name: "Seller One",
    email: "seller1@bookhub.com",
    role: "SELLER",
  },
  {
    id: "user-3",
    name: "Buyer One",
    email: "buyer1@bookhub.com",
    role: "BUYER",
  },
  {
    id: "user-4",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "BUYER",
  },
  {
    id: "user-5",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "BUYER",
  },
  {
    id: "user-6",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "SELLER",
  },
  {
    id: "user-7",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "BUYER",
  },
  {
    id: "user-8",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "BUYER",
  },
  {
    id: "user-9",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "SELLER",
  },
  {
    id: "user-10",
    name: "Edward Norton",
    email: "edward.norton@example.com",
    role: "BUYER",
  },
];

// Mock users with passwords for authentication (matching lib/mock/data.ts)
const mockAuthUsers = [
  {
    id: 1,
    email: "buyer@test.com",
    password: "password123", // In mock mode only!
    firstName: "John",
    lastName: "Buyer",
    role: "BUYER" as const,
  },
  {
    id: 2,
    email: "seller@test.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Seller",
    role: "SELLER" as const,
  },
  {
    id: 3,
    email: "admin@test.com",
    password: "password123",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN" as const,
  },
];

let books = [...mockBooks];
let orders = [...mockOrders];
let users = [...mockUsers];

export const handlers = [
  // ============ AUTHENTICATION API ============

  // POST /api/v1/auth/login - Login user
  http.post("http://localhost:8080/api/v1/auth/login", async ({ request }) => {
    try {
      const body = (await request.json()) as { email: string; password: string };
      const { email, password } = body;

      // Validation
      if (!email || !password) {
        return HttpResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      // Trim whitespace
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Find user (case-insensitive email comparison)
      const user = mockAuthUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail && u.password === trimmedPassword
      );

      if (!user) {
        return HttpResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Generate mock JWT token
      const mockToken = Buffer.from(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
      ).toString("base64");

      // Return AuthResponse matching the expected format
      return HttpResponse.json({
        token: mockToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return HttpResponse.json(
        { error: "Authentication service unavailable" },
        { status: 500 }
      );
    }
  }),

  // POST /api/v1/auth/register - Register new user
  http.post("http://localhost:8080/api/v1/auth/register", async ({ request }) => {
    try {
      const body = (await request.json()) as {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
      };
      const { email, password, firstName, lastName, role } = body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        return HttpResponse.json(
          {
            error: "Missing required fields: firstName, lastName, email, password",
          },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return HttpResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 422 }
        );
      }

      // Check if email already exists
      const existingUser = mockAuthUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingUser) {
        return HttpResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }

      // Create new user
      const newUser = {
        id: mockAuthUsers.length > 0 
          ? Math.max(...mockAuthUsers.map((u) => u.id)) + 1 
          : 1,
        email: email.trim(),
        password: password.trim(), // In mock mode only!
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: (role as "BUYER" | "SELLER" | "ADMIN") || "BUYER" as const,
      };

      mockAuthUsers.push(newUser);

      // Generate mock JWT token
      const mockToken = Buffer.from(
        JSON.stringify({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
      ).toString("base64");

      // Return AuthResponse
      return HttpResponse.json(
        {
          token: mockToken,
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Registration error:", error);
      return HttpResponse.json(
        { error: "Registration service unavailable" },
        { status: 500 }
      );
    }
  }),

  // GET /api/v1/auth/me - Get current user info
  http.get("http://localhost:8080/api/v1/auth/me", ({ request }) => {
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      
      // Find user by ID from token
      const user = mockAuthUsers.find((u) => u.id === decoded.userId);
      if (!user) {
        return HttpResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }),

  // ============ BOOKS API ============
  
  // GET /api/v1/book - Fetch all books
  http.get("http://localhost:8080/api/v1/book", () => {
    return HttpResponse.json(books);
  }),

  // GET /api/v1/book/:id - Get single book
  http.get("http://localhost:8080/api/v1/book/:id", ({ params }) => {
    const book = books.find((b) => b.bookId === Number(params.id));
    if (!book) {
      return HttpResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(book);
  }),

  // POST /api/v1/book - Create new book
  http.post("http://localhost:8080/api/v1/book", async ({ request }) => {
    const newBook = (await request.json()) as any;
    const book = {
      bookId: books.length > 0 ? Math.max(...books.map((b) => b.bookId)) + 1 : 1,
      bookName: newBook.bookName || "",
      bookDescription: newBook.bookDescription || "",
      bookPrice: newBook.bookPrice || 0,
      bookPicture: newBook.bookPicture || "",
    };
    books.push(book);
    return HttpResponse.json(book, { status: 201 });
  }),

  // PUT /api/v1/book/:id - Update book
  http.put(
    "http://localhost:8080/api/v1/book/:id",
    async ({ params, request }) => {
      const updated = (await request.json()) as any;
      const index = books.findIndex((b) => b.bookId === Number(params.id));
      
      if (index === -1) {
        return HttpResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }

      books[index] = {
        ...books[index],
        bookName: updated.bookName ?? books[index].bookName,
        bookDescription: updated.bookDescription ?? books[index].bookDescription,
        bookPrice: updated.bookPrice ?? books[index].bookPrice,
        bookPicture: updated.bookPicture ?? books[index].bookPicture,
      };

      return HttpResponse.json(books[index]);
    }
  ),

  // DELETE /api/v1/book/:id - Delete book
  http.delete("http://localhost:8080/api/v1/book/:id", ({ params }) => {
    const index = books.findIndex((b) => b.bookId === Number(params.id));
    
    if (index === -1) {
      return HttpResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    books.splice(index, 1);
    return HttpResponse.json({ message: "Book deleted successfully" });
  }),

  // ============ ORDERS API ============

  // GET /api/orders - Fetch all orders or filter by customerEmail
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const customerEmail = url.searchParams.get("customerEmail");

    // If customerEmail is provided, filter orders by that email
    if (customerEmail) {
      const filteredOrders = orders.filter(
        (order) => order.customerEmail?.toLowerCase() === customerEmail.toLowerCase()
      );
      return HttpResponse.json(filteredOrders);
    }

    // Otherwise return all orders (for admins/sellers)
    return HttpResponse.json(orders);
  }),

  // GET /api/orders/:id - Get single order
  http.get("/api/orders/:id", ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) {
      return HttpResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(order);
  }),

  // POST /api/v1/order - Create new order (checkout)
  http.post("http://localhost:8080/api/v1/order", async ({ request }) => {
    const orderData = (await request.json()) as any;
    
    // Extract customer info from shipping address or use defaults
    const shippingParts = orderData.shippingAddress?.split(",") || [];
    const customerName = shippingParts[0]?.trim() || "Customer";
    const customerEmail = orderData.userId?.includes("@") 
      ? orderData.userId 
      : `${orderData.userId}@example.com`;
    
    // Use the total from orderData (calculated by submitOrder)
    const orderTotal = orderData.total || 0;
    
    // Create a new order for the orders list (used by /api/orders)
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      customerName: customerName,
      customerEmail: customerEmail,
      total: orderTotal,
      amount: orderTotal,
      createdAt: new Date().toISOString(),
      status: "Completed",
      date: new Date().toISOString().split("T")[0],
    };

    orders.push(newOrder);
    
    // Return order in the format expected by ApiOrder interface
    return HttpResponse.json({
      userId: orderData.userId,
      cartId: orderData.cartId,
      itemCount: orderData.itemCount || 1,
      total: orderTotal,
      status: "PLACED",
      placedAt: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
    }, { status: 201 });
  }),

  // ============ CART API (if needed) ============

  // GET /api/v1/cart - Get cart
  http.get("http://localhost:8080/api/v1/cart", () => {
    return HttpResponse.json({
      items: [],
      total: 0,
    });
  }),

  // POST /api/v1/cart - Add item to cart
  http.post("http://localhost:8080/api/v1/cart", async ({ request }) => {
    const item = (await request.json()) as any;
    return HttpResponse.json(
      { itemId: "cart-item-1", ...item },
      { status: 201 }
    );
  }),

  // ============ USERS API ============

  // GET /api/users - Get all users (for admin panel)
  http.get("/api/users", () => {
    return HttpResponse.json(users);
  }),

  // GET /api/users/:id - Get single user
  http.get("/api/users/:id", ({ params }) => {
    const user = users.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(user);
  }),

  // PUT /api/users/:id - Update user (e.g., change role)
  http.put("/api/users/:id", async ({ params, request }) => {
    const updated = (await request.json()) as any;
    const index = users.findIndex((u) => u.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role or other fields
    users[index] = {
      ...users[index],
      role: updated.role ?? users[index].role,
      name: updated.name ?? users[index].name,
      email: updated.email ?? users[index].email,
    };

    return HttpResponse.json(users[index]);
  }),

  // GET /api/v1/user/me - Get current user
  http.get("http://localhost:8080/api/v1/user/me", () => {
    return HttpResponse.json({
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "ADMIN",
    });
  }),
];
