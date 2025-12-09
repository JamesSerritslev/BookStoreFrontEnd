# Backend Docker Instructions

## Instructions for Backend Team: Using Docker Image

This document provides instructions for the backend team on how to create, build, and use a Docker image for the backend service.

---

## 📋 Requirements

- **Port**: Backend must run on **port 8080** (frontend expects `http://localhost:8080`)
- **API Base Path**: All API endpoints should be under `/api/v1/` (e.g., `/api/v1/auth/login`)
- **CORS**: Must allow requests from frontend origin
- **Environment Variables**: Support configuration via environment variables

---

## 🐳 Step 1: Create Dockerfile

A `Dockerfile` has been created in the `backend/` directory. Here's what it does:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p uploads
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]
```

**Key Points:**
- Uses Node.js 18 Alpine (lightweight)
- Installs only production dependencies
- Exposes port 8080
- Creates uploads directory for file uploads

---

## 🔨 Step 2: Build the Docker Image

### Option A: Build from Backend Directory

```bash
cd backend
docker build -t bookstore-backend:latest .
```

### Option B: Build from Project Root

```bash
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/
```

### Option C: Build with Version Tag

```bash
docker build -t bookstore-backend:v1.0.0 -f backend/Dockerfile backend/
```

**Verify the image was created:**
```bash
docker images | grep bookstore-backend
```

---

## 🚀 Step 3: Update server.js to Use Port 8080

**IMPORTANT**: Ensure your `server.js` uses the PORT environment variable:

```javascript
const PORT = process.env.PORT || 8080;  // Default to 8080, not 3000
```

The Dockerfile sets `ENV PORT=8080`, but your code should respect this.

---

## 📦 Step 4: Use the Image in docker-compose.yml

The frontend team's `docker-compose.yml` should be updated to use your built image:

### Option A: Use Pre-built Image

```yaml
backend:
  image: bookstore-backend:latest  # Your built image
  container_name: backend
  ports:
    - "8080:8080"  # Host:Container - MUST be 8080
  environment:
    - NODE_ENV=production
    - PORT=8080
    - DATABASE_URL=postgresql://myuser:mypassword@database:5432/mydb
    - JWT_SECRET=your-secret-key-change-this
  depends_on:
    database:
      condition: service_healthy
  networks:
    - app-network
  volumes:
    - ./backend/uploads:/app/uploads  # Persist uploads
  restart: unless-stopped
```

### Option B: Build from Dockerfile in docker-compose

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: backend
  ports:
    - "8080:8080"
  environment:
    - NODE_ENV=production
    - PORT=8080
    - DATABASE_URL=postgresql://myuser:mypassword@database:5432/mydb
    - JWT_SECRET=your-secret-key-change-this
  depends_on:
    database:
      condition: service_healthy
  networks:
    - app-network
  volumes:
    - ./backend/uploads:/app/uploads
  restart: unless-stopped
```

---

## 🧪 Step 5: Test the Image Locally

### Run the container manually:

```bash
docker run -d \
  --name backend-test \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  bookstore-backend:latest
```

### Test the API:

```bash
# Check if server is running
curl http://localhost:8080/

# Should return: "Backend is running"
```

### View logs:

```bash
docker logs backend-test
```

### Stop and remove:

```bash
docker stop backend-test
docker rm backend-test
```

---

## 📤 Step 6: Share the Image with Frontend Team

### Option A: Push to Docker Hub (Recommended)

1. **Create Docker Hub account** (if you don't have one)
2. **Tag your image:**
   ```bash
   docker tag bookstore-backend:latest your-username/bookstore-backend:latest
   ```
3. **Login to Docker Hub:**
   ```bash
   docker login
   ```
4. **Push the image:**
   ```bash
   docker push your-username/bookstore-backend:latest
   ```
5. **Share the image name** with frontend team:
   ```
   your-username/bookstore-backend:latest
   ```

### Option B: Save as Tar File

1. **Save the image:**
   ```bash
   docker save bookstore-backend:latest -o bookstore-backend.tar
   ```
2. **Compress (optional):**
   ```bash
   gzip bookstore-backend.tar
   ```
3. **Share the file** with frontend team (via shared drive, email, etc.)
4. **Frontend team loads it:**
   ```bash
   docker load -i bookstore-backend.tar
   ```

### Option C: Use Private Registry

If your organization uses a private registry:
```bash
docker tag bookstore-backend:latest registry.example.com/bookstore-backend:latest
docker push registry.example.com/bookstore-backend:latest
```

---

## 🔧 Environment Variables

Your backend should support these environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8080` | Yes |
| `NODE_ENV` | Environment (development/production) | `production` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | Secret for JWT tokens | - | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | No |

**Example `.env` file:**
```env
PORT=8080
NODE_ENV=production
DATABASE_URL=postgresql://user:password@database:5432/bookstore
JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

---

## ✅ Checklist for Backend Team

- [ ] Dockerfile created in `backend/` directory
- [ ] Server configured to use `PORT` environment variable (defaults to 8080)
- [ ] All API routes under `/api/v1/` prefix
- [ ] CORS configured to allow frontend requests
- [ ] Image builds successfully: `docker build -t bookstore-backend:latest -f backend/Dockerfile backend/`
- [ ] Image runs and responds on port 8080
- [ ] Environment variables documented
- [ ] Image shared with frontend team (Docker Hub, tar file, or registry)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker logs backend

# Run interactively to debug
docker run -it --rm bookstore-backend:latest sh
```

### Image Not Found
```bash
# List all images
docker images

# Rebuild if needed
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/
```

### Database Connection Issues
- Ensure database service is running: `docker-compose ps database`
- Check DATABASE_URL format: `postgresql://user:password@host:port/dbname`
- Verify network connectivity: containers must be on same network

---

## 📝 Integration with Frontend

Once the image is ready, the frontend team will:

1. **Pull/load your image:**
   ```bash
   docker pull your-username/bookstore-backend:latest
   # OR
   docker load -i bookstore-backend.tar
   ```

2. **Update docker-compose.yml:**
   ```yaml
   backend:
     image: your-username/bookstore-backend:latest
     ports:
       - "8080:8080"
   ```

3. **Start services:**
   ```bash
   docker-compose up -d backend
   ```

4. **Frontend will connect to:** `http://localhost:8080`

---

## 📞 Contact

If you have questions or issues:
- Check the main `DOCKER_BACKEND_GUIDE.md` for more details
- Verify your API endpoints match the frontend's expectations
- Ensure port 8080 is correctly configured

---

## 🎯 Quick Reference Commands

```bash
# Build image
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/

# Run locally
docker run -d -p 8080:8080 --name backend bookstore-backend:latest

# Test
curl http://localhost:8080/

# View logs
docker logs backend

# Stop
docker stop backend && docker rm backend

# Push to Docker Hub
docker tag bookstore-backend:latest your-username/bookstore-backend:latest
docker push your-username/bookstore-backend:latest
```

