# Frontend Docker Setup Instructions

## Step 1: Git Clone Repository

```bash
git clone https://github.com/JamesSerritslev/BookStoreFrontEnd.git

cd BookStoreFrontEnd
```

**Note:** The directory name is `BookStoreFrontEnd` (with capital S, F, and E).

---

## Step 2: Build the Frontend Docker Image

```bash
docker build -t bookstore-frontend ./frontend
```

This will:
- Build the Vite React application
- Create a production-ready Docker image with Nginx
- Tag it as `bookstore-frontend`

---

## Step 3: Run the Frontend Container

```bash
docker run -d -p 80:80 --name frontend bookstore-frontend
```

This will:
- Run the frontend container in detached mode (`-d`)
- Map port 80 on your host to port 80 in the container
- Name the container `frontend`

**Access the frontend at:** `http://localhost`

---

## Step 4: Configuration for Backend Integration

### Backend API URL

The frontend expects the backend API to be available at:

**`http://localhost:8080`**

### To Change API URL

Update the following file:

**`frontend/src/config.ts`**

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
```

**Or use environment variable:**

You can also set the API URL using an environment variable when building:

```bash
docker build --build-arg VITE_API_URL=http://your-backend-url:8080 -t bookstore-frontend ./frontend
```

**Or modify the config file directly:**

1. Edit `frontend/src/config.ts`
2. Change the default URL:
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

## Additional Commands

### View Container Logs

```bash
docker logs frontend
```

### Stop the Container

```bash
docker stop frontend
```

### Remove the Container

```bash
docker rm frontend
```

### Restart the Container

```bash
docker restart frontend
```

---

## Using Docker Compose (Alternative)

You can also use docker-compose to manage the frontend:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    ports:
      - "80:80"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d frontend
```

---

## Troubleshooting

### Port 80 Already in Use

If port 80 is already in use, you can map to a different port:

```bash
docker run -d -p 3000:80 --name frontend bookstore-frontend
```

Then access at: `http://localhost:3000`

### Container Won't Start

Check the logs:

```bash
docker logs frontend
```

### Rebuild After Code Changes

1. Make your changes to the frontend code
2. Rebuild the image: `docker build -t bookstore-frontend ./frontend`
3. Remove old container: `docker rm -f frontend`
4. Run new container: `docker run -d -p 80:80 --name frontend bookstore-frontend`

---

## Important Notes

- **Backend Port:** The frontend expects the backend on port **8080** (not 3000)
- **Config File:** The config file is `frontend/src/config.ts` (TypeScript, not JavaScript)
- **API Base Path:** All API calls should be under `/api/v1/` prefix
- **CORS:** Ensure your backend allows CORS requests from the frontend origin

---

## Quick Reference

```bash
# Clone repository
git clone https://github.com/JamesSerritslev/BookStoreFrontEnd.git
cd BookStoreFrontEnd

# Build image
docker build -t bookstore-frontend ./frontend

# Run container
docker run -d -p 80:80 --name frontend bookstore-frontend

# Update config (if needed)
# Edit frontend/src/config.ts
# Change: export const API_BASE_URL = "http://localhost:8080";

# Rebuild after config change
docker build -t bookstore-frontend ./frontend
docker rm -f frontend
docker run -d -p 80:80 --name frontend bookstore-frontend
```

