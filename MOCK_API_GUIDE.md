# Mock API System Guide

## Overview

This project now has a **centralized mock API system** that makes it easy to develop and test the frontend without a running backend. When you're ready to integrate with the real backend, you can switch with a single environment variable.

## Quick Start

### Using Mock Mode (Default)

Mock mode is enabled by default. Just run the dev server:

```bash
npm run dev
```

The app will use local Next.js API routes at `/api/v1/*` with mock data stored in memory.

### Switching to Real Backend

When backend is ready, update `.env.local`:

```bash
# Change this line
NEXT_PUBLIC_USE_MOCK_API=false

# Make sure this points to your backend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Restart your dev server and you're done!

## Architecture

### 1. Environment Configuration (`lib/config.ts`)

- **`USE_MOCK_API`**: Boolean flag from environment
- **`API_BASE_URL`**: Empty string (Next.js routes) or backend URL
- **`getApiUrl(path)`**: Constructs full URLs
- **`getApiHeaders()`**: Adds auth tokens automatically

### 2. Mock Data Store (`lib/mock/data.ts`)

- **Centralized in-memory store** for all mock data
- Pre-populated with test users, books, carts, orders, reviews
- **UUIDs** match backend format
- **Prices in cents** (as per backend contract)

**Default Test Users:**

- `buyer@test.com` / `password123` (BUYER role)
- `seller@test.com` / `password123` (SELLER role)
- `admin@test.com` / `password123` (ADMIN role)

### 3. Next.js API Routes (`app/api/v1/*`)

All backend endpoints are implemented as Next.js route handlers:

**Auth:**

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

**Books:**

- `GET /api/v1/book` (public)
- `POST /api/v1/book` (SELLER/ADMIN only)
- `PUT /api/v1/book/{bookId}` (SELLER/ADMIN only)
- `DELETE /api/v1/book/{bookId}` (SELLER/ADMIN only)

**Cart:**

- `GET /api/v1/cart/me`
- `POST /api/v1/cart/me/items`
- `PATCH /api/v1/cart/me/items/{itemId}`
- `DELETE /api/v1/cart/me/items/{itemId}`
- `POST /api/v1/cart/me/clear`

**Orders:**

- `GET /api/v1/order`
- `POST /api/v1/order/place`
- `POST /api/v1/order/return`

**Reviews:**

- `GET /api/v1/books/{bookId}/reviews`
- `GET /api/v1/books/{bookId}/reviews/summary`
- `POST /api/v1/books/{bookId}/reviews`
- `PATCH /api/v1/reviews/{reviewId}`
- `DELETE /api/v1/reviews/{reviewId}`

### 4. API Client Layer (`lib/api/*`)

Your existing API functions (e.g., `lib/api/cart.ts`) now:

- Use `getApiUrl()` to build URLs
- Use `getApiHeaders()` for auth
- **No inline mock logic** — all handled by routes

## Benefits

### ✅ For Development

- **No backend required** — work on frontend independently
- **Realistic responses** — matches backend contract exactly
- **Fast iteration** — no network latency
- **Test all scenarios** — easily modify mock data

### ✅ For Integration

- **One-line toggle** — switch to real backend instantly
- **Contract validation** — catch API mismatches early
- **Easy debugging** — inspect responses in Next.js console
- **No code changes** — components don't know the difference

### ✅ For Team

- **QA can test** — without backend running
- **Designers can demo** — with realistic data
- **Backend independence** — parallel development streams

## Mock Data Persistence

**Per-session:** Mock data persists during your dev server session (browser refreshes maintain data).

**Resets on:** Server restart or page reload if server was restarted.

**To reset manually:** Restart your dev server.

## Testing Auth

### Login Flow

```typescript
// In your browser console or component
const response = await fetch("/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "buyer@test.com",
    password: "password123",
  }),
});

const { token, user } = await response.json();
localStorage.setItem("token", token);
```

### Register New User

```typescript
const response = await fetch("/api/v1/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password123",
    role: "BUYER",
  }),
});
```

## Adding New Mock Data

### Add Books

Edit `lib/mock/data.ts`:

```typescript
books: MockBook[] = [
  // Add your mock book here
  {
    bookId: 4,
    bookName: 'New Book Title',
    bookDescription: 'Description here',
    bookPrice: 29.99,
    bookPicture: 'https://...',
    createdAt: new Date().toISOString(),
  },
  // ...
];
```

### Add Test Users

```typescript
users: MockUser[] = [
  {
    id: 4,
    email: 'newuser@test.com',
    password: 'password123',
    firstName: 'New',
    lastName: 'User',
    role: 'BUYER',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  // ...
];
```

## Troubleshooting

### Mock banner not showing

**Cause:** Environment variable not set  
**Fix:** Check `.env.local` has `NEXT_PUBLIC_USE_MOCK_API=true` and restart dev server

### Still hitting real backend

**Cause:** Environment variable is false or typo  
**Fix:** Verify `.env.local` spelling (must be `NEXT_PUBLIC_USE_MOCK_API`)

### Cart data resets on refresh

**Expected:** Mock data is in-memory only  
**Fix:** This is normal behavior; backend will persist data

### Auth token expired

**Cause:** Mock tokens expire after 24 hours  
**Fix:** Login again to get new token

### Changes to mock data not appearing

**Cause:** Server not restarted  
**Fix:** Restart `npm run dev` after editing `lib/mock/data.ts`

## Backend Integration Checklist

When backend is ready:

- [ ] Confirm backend is running (e.g., `http://localhost:8080`)
- [ ] Test one endpoint manually (e.g., `GET /api/v1/book`)
- [ ] Update `.env.local`: `NEXT_PUBLIC_USE_MOCK_API=false`
- [ ] Update `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [ ] Restart dev server
- [ ] Test auth flow (login/register)
- [ ] Test a few key flows (browse books, add to cart)
- [ ] Check for CORS errors (backend needs to allow your frontend origin)

## API Contract Compliance

All mock routes match your backend contract:

- **Auth responses:** `{ token, user }` structure
- **ApiResponse envelope:** `{ success, message, data, error }`
- **Error codes:** `VALIDATION_FAILED`, `UNAUTHORIZED`, etc.
- **Status codes:** 200, 201, 204, 400, 401, 403, 404, 409, 422, 500
- **UUIDs:** Proper format for IDs
- **Money:** Prices in cents (integers)
- **Timestamps:** ISO-8601 UTC

## Next Steps

1. **Develop features** using mock API (already enabled)
2. **Test thoroughly** with different user roles
3. **Add more mock data** as needed for your scenarios
4. **When backend is ready** → flip the env variable
5. **Fix any integration issues** (usually CORS or auth token format)
6. **Deploy** with confidence!

---

**Questions?** Check `lib/config.ts` for configuration details or inspect `app/api/v1/*` to see how routes work.
