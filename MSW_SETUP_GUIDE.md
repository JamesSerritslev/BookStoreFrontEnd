# 🎭 MSW (Mock Service Worker) Setup Guide

## Overview

This project uses **MSW (Mock Service Worker)** to mock backend API calls during development. MSW intercepts network requests and returns mock data, allowing frontend development without a running backend server.

---

## ✅ What's Configured

### 1. **MSW Package**
- Installed: `msw@2.12.2` (in `devDependencies`)
- Service Worker: `public/mockServiceWorker.js` (auto-generated)

### 2. **Mock Handlers**
- Location: `src/mocks/handlers.ts`
- Contains 17+ API endpoint handlers
- Includes mock data for books, orders, users, cart, and auth

### 3. **MSW Provider**
- File: `app/providers.tsx`
- Auto-starts MSW in development mode
- Wrapped around entire app in `app/layout.tsx`

### 4. **API Configuration**
- File: `lib/config.ts`
- All API calls point to `http://localhost:8080`
- MSW intercepts these calls in development

---

## 🚀 How to Use

### **Start Development Server**

```bash
npm run dev
```

MSW will automatically start and intercept API calls!

### **Verify MSW is Running**

1. Open browser to `http://localhost:3000`
2. Open DevTools Console (F12)
3. You should see:
   ```
   [MSW] Mocking enabled.
   ```

### **Check Intercepted Requests**

When you make API calls (login, add to cart, etc.), you'll see in console:
```
[MSW] POST http://localhost:8080/api/v1/auth/login (200 OK)
[MSW] GET http://localhost:8080/api/v1/book (200 OK)
```

---

## 📋 Available Mock Endpoints

### **Authentication**
- `POST /api/v1/auth/login` - Login with mock users
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/user/me` - Get user profile

### **Books**
- `GET /api/v1/book` - Get all books
- `GET /api/v1/book/:id` - Get book by ID
- `POST /api/v1/book` - Create new book
- `PUT /api/v1/book/:id` - Update book
- `DELETE /api/v1/book/:id` - Delete book

### **Cart**
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart` - Add item to cart

### **Orders**
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/v1/order` - Create new order

### **Users**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

---

## 🔑 Mock User Credentials

Test login with these accounts (defined in `src/mocks/handlers.ts`):

### **Buyer Account**
- Email: `buyer@test.com`
- Password: `password123`
- Role: BUYER

### **Seller Account**
- Email: `seller@test.com`
- Password: `password123`
- Role: SELLER

### **Admin Account**
- Email: `admin@test.com`
- Password: `password123`
- Role: ADMIN

---

## 📦 Mock Data

Mock data is defined in `src/mocks/handlers.ts`:

- **Books**: 3 mock books (Great Gatsby, To Kill a Mockingbird, 1984)
- **Orders**: 7 mock orders with various statuses
- **Users**: Mock users for buyer, seller, admin
- **Cart**: Empty cart initialized per user

You can modify this data by editing `src/mocks/handlers.ts`!

---

## 🛠️ Customizing Mock Responses

### **Adding New Endpoints**

Edit `src/mocks/handlers.ts`:

```typescript
export const handlers = [
  // ... existing handlers ...
  
  // Add your new handler
  http.get("http://localhost:8080/api/v1/your-endpoint", () => {
    return HttpResponse.json({
      success: true,
      data: { /* your mock data */ }
    });
  }),
];
```

### **Modifying Mock Data**

Edit the mock data arrays in `src/mocks/handlers.ts`:

```typescript
const mockBooks = [
  {
    bookId: 1,
    bookName: "Your Book Title",
    bookDescription: "Description here",
    bookPrice: 19.99,
    bookPicture: "https://example.com/image.jpg",
  },
  // ... add more books
];
```

### **Simulating Errors**

```typescript
http.get("http://localhost:8080/api/v1/book/:id", ({ params }) => {
  const { id } = params;
  
  // Simulate 404 for specific ID
  if (id === "999") {
    return HttpResponse.json(
      { error: "Book not found" },
      { status: 404 }
    );
  }
  
  return HttpResponse.json({ /* success data */ });
}),
```

---

## 🔄 Switching to Real Backend

When your backend is ready:

1. **Start your backend server** on `http://localhost:8080`
2. **Disable MSW** by editing `app/providers.tsx`:
   ```typescript
   // Comment out or set to false
   if (false && typeof window !== "undefined" && process.env.NODE_ENV === "development") {
     // MSW won't start
   }
   ```
3. **OR** set environment variable:
   ```bash
   # .env.local
   NODE_ENV=production  # MSW only runs in development
   ```

---

## 🐛 Troubleshooting

### **MSW Not Starting**

Check browser console for errors. Common issues:
- Service worker not registered
- HTTPS issues (MSW works best with HTTP in development)

**Solution**: Verify `public/mockServiceWorker.js` exists

### **MSW Not Intercepting Requests**

1. Check that API_BASE_URL is `http://localhost:8080` in `lib/config.ts`
2. Verify handlers are defined for the endpoint in `src/mocks/handlers.ts`
3. Check console for `[MSW]` logs

### **Regenerate Service Worker**

If `public/mockServiceWorker.js` is corrupted:

```bash
npx msw init ./public --save
```

---

## 📚 Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW Recipes](https://mswjs.io/docs/recipes)
- [Handler Examples](https://mswjs.io/docs/basics/mocking-responses)

---

## 🎯 Quick Start Checklist

- [x] MSW installed and configured
- [x] Service worker generated in `public/`
- [x] Handlers defined in `src/mocks/handlers.ts`
- [x] MSWProvider initialized in `app/layout.tsx`
- [x] API config points to backend URL
- [ ] Test login with mock credentials
- [ ] Verify console shows `[MSW] Mocking enabled`
- [ ] Check intercepted requests in console

---

**Ready to go!** Start your dev server and MSW will handle all API calls automatically! 🚀

