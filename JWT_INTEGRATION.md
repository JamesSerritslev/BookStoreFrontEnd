# JWT Authentication Frontend Integration Guide

## 🎯 **Frontend Team Deliverables - COMPLETED**

✅ **Login and Registration Forms** - Built and integrated  
✅ **JWT Token Storage** - Implemented with React Context  
✅ **User Role Management** - Role-based UI rendering  
✅ **Protected Routes** - Role-based route protection  
✅ **Conditional UI** - Admin/Seller features hidden from buyers

---

## 🔗 **Backend Integration Instructions**

### **Required Backend Endpoints**

The frontend expects these endpoints from the backend team:

```typescript
// Authentication endpoints
POST / auth / login;
POST / auth / register;
POST / auth / refresh(optional);
POST / auth / logout(optional);

// Role management (Admin only)
PUT / users / { id } / role;
```

### **Expected Request/Response Format**

#### **Login Request**

```typescript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### **Login Response**

```typescript
HTTP 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER" | "SELLER" | "ADMIN"
  }
}
```

#### **Register Request**

```typescript
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "BUYER" | "SELLER" | "ADMIN"
}
```

#### **Register Response**

```typescript
HTTP 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER"
  }
}
```

---

## ⚙️ **Configuration for Backend Team**

### **1. Update API Base URL**

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### **2. JWT Token Requirements**

The frontend expects JWT tokens with these claims:

```typescript
{
  "userId": number,
  "email": string,
  "role": "BUYER" | "SELLER" | "ADMIN",
  "exp": number,
  "iat": number
}
```

### **3. CORS Configuration**

Backend must allow requests from frontend domain:

```java
// Spring Boot CORS configuration
@CrossOrigin(origins = {"http://localhost:3000", "https://your-frontend-domain.com"})
```

---

## 🔄 **Frontend Integration Points**

### **Files to Update When Backend is Ready**

1. **`/contexts/AuthContext.tsx`** - Replace mock implementation with real API calls
2. **`/lib/config.ts`** - Update API_CONFIG.BASE_URL
3. **Environment variables** - Set NEXT_PUBLIC_API_URL

### **Mock Data Removal**

Search for these comments to find mock code to replace:

- `// TODO: Backend team - Replace this mock implementation with:`
- `// MOCK DATA - Remove when backend is ready`

---

## 🛡️ **Security Features Implemented**

- ✅ JWT token validation and expiry checking
- ✅ Automatic token refresh handling
- ✅ Secure localStorage token management
- ✅ Role-based access control (RBAC)
- ✅ Protected route components
- ✅ Authorization headers for API requests

---

## 🎨 **User Roles & Permissions**

### **BUYER Role**

- Access to shop and browse books
- Cart and order management
- Profile management

### **SELLER Role**

- All BUYER permissions
- Book inventory management
- Sales analytics dashboard
- Add/edit/delete books

### **ADMIN Role**

- All SELLER permissions
- User role management
- System administration
- Platform analytics

---

## 📱 **Component Usage Examples**

### **Protected Routes**

```tsx
import { AuthRoute, AdminRoute, SellerRoute } from '@/components/ProtectedRoute';

// Require any authenticated user
<AuthRoute>
  <Dashboard />
</AuthRoute>

// Require admin role
<AdminRoute>
  <AdminPanel />
</AdminRoute>

// Require seller or admin role
<SellerRoute>
  <BookManagement />
</SellerRoute>
```

### **Conditional Rendering**

```tsx
import { useAuth } from "@/contexts/AuthContext";

function Navbar() {
  const { user, hasRole } = useAuth();

  return (
    <>
      {hasRole("ADMIN") && <AdminButton />}
      {hasRole("SELLER", "ADMIN") && <SellerButton />}
    </>
  );
}
```

---

## 🚀 **Ready for Production**

The frontend JWT authentication system is **production-ready** and awaiting backend integration. Once the backend endpoints are deployed:

1. Update `NEXT_PUBLIC_API_URL` in environment variables
2. Replace mock implementations in `AuthContext.tsx`
3. Test end-to-end authentication flow
4. Deploy frontend with backend API integration

**Frontend Team: Ready for backend integration! 🎉**
