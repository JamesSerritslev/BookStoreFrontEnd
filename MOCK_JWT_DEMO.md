# Mock JWT Authentication Demo for Postman Screenshots

## 🔐 **Mock JWT Token Structure**

### **Header:**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### **Payload (Claims):**

```json
{
  "userId": 1,
  "email": "admin@bookhub.com",
  "role": "ADMIN",
  "firstName": "John",
  "lastName": "Doe",
  "exp": 1735689600,
  "iat": 1735603200
}
```

### **Complete Mock JWT Token:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYm9va2h1Yi5jb20iLCJyb2xlIjoiQURNSU4iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJleHAiOjE3MzU2ODk2MDAsImlhdCI6MTczNTYwMzIwMH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## 📱 **Postman Screenshot Setup**

### **Login Request:**

- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "email": "admin@bookhub.com",
  "password": "admin123"
}
```

### **Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYm9va2h1Yi5jb20iLCJyb2xlIjoiQURNSU4iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJleHAiOjE3MzU2ODk2MDAsImlhdCI6MTczNTYwMzIwMH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "user": {
    "id": 1,
    "email": "admin@bookhub.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ADMIN"
  }
}
```

### **Registration Request:**

- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "seller@bookhub.com",
  "password": "seller123",
  "role": "SELLER"
}
```

### **Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoic2VsbGVyQGJvb2todWIuY29tIiwicm9sZSI6IlNFTExFUiIsImZpcnN0TmFtZSI6IkphbmUiLCJsYXN0TmFtZSI6IlNtaXRoIiwiZXhwIjoxNzM1Njg5NjAwLCJpYXQiOjE3MzU2MDMyMDB9.def456ghi789jkl012mno345pqr678stu901vwx234yzabc123",
  "user": {
    "id": 2,
    "email": "seller@bookhub.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "SELLER"
  }
}
```

## 🎯 **JWT Token Decoded (for verification):**

### **Admin Token Claims:**

- **userId:** 1
- **email:** admin@bookhub.com
- **role:** ADMIN
- **exp:** 1735689600 (expires in 24 hours)
- **iat:** 1735603200 (issued now)

### **Seller Token Claims:**

- **userId:** 2
- **email:** seller@bookhub.com
- **role:** SELLER
- **exp:** 1735689600 (expires in 24 hours)
- **iat:** 1735603200 (issued now)

## 📸 **Screenshot Instructions:**

1. **Open Postman**
2. **Create new request** for login
3. **Set method to POST**
4. **Set URL to:** `http://localhost:8080/api/auth/login`
5. **Add headers:** `Content-Type: application/json`
6. **Add body** with admin credentials
7. **Send request** (will show error since backend isn't ready)
8. **Take screenshot** showing the request setup
9. **Repeat for registration** with seller credentials

## 📝 **Note for Submission:**

_"Frontend JWT authentication system is complete and ready. Postman screenshots show the expected API contract. Backend team needs to implement these endpoints to complete the integration."_
