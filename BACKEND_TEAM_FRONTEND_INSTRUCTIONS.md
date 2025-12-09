# Frontend Docker Setup Instructions for Backend Team

## Step 1: Git Clone Repository

```bash
git clone https://github.com/JamesSerritslev/BookStoreFrontEnd.git

cd BookStoreFrontEnd
```

**Note:** Directory name is `BookStoreFrontEnd` (capital S, F, and E).

---

## Step 2: Build the Frontend Docker Image

```bash
docker build -t bookstore-frontend ./frontend
```

---

## Step 3: Run the Frontend Container

```bash
docker run -d -p 80:80 --name frontend bookstore-frontend
```

The frontend will be available at: `http://localhost`

---

## Step 4: Configuration for Backend Integration

### Backend API URL

The frontend expects the backend API to be available at:

**`http://localhost:8080`**

### To Change API URL

Update the following file:

**`frontend/src/config.ts`**

Change this line:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
```

To point to your backend URL, for example:

```typescript
export const API_BASE_URL = "http://your-backend-url:8080";
```

### Rebuild Docker Image After Changing Config

After modifying the config file, rebuild the Docker image:

```bash
docker build -t bookstore-frontend ./frontend
```

Then restart the container:

```bash
docker stop frontend
docker rm frontend
docker run -d -p 80:80 --name frontend bookstore-frontend
```

---

## Important Notes

- **Backend Port:** Frontend expects backend on port **8080** (not 3000)
- **Config File:** `frontend/src/config.ts` (TypeScript file, not JavaScript)
- **API Paths:** All API endpoints should be under `/api/v1/` prefix

