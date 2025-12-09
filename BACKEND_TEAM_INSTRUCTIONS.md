# Instructions for Backend Team: Docker Image Setup

## 🎯 Quick Summary

The frontend expects the backend to run on **port 8080** at `http://localhost:8080`. You need to create a Docker image for your backend service.

---

## ✅ What You Need to Do

### 1. **Update server.js Port** (Already Done ✓)
   - Changed default port from 3000 to 8080
   - Uses `process.env.PORT || 8080`

### 2. **Create Dockerfile** (Already Created ✓)
   - Location: `backend/Dockerfile`
   - Builds Node.js 18 Alpine image
   - Exposes port 8080

### 3. **Build the Docker Image**

```bash
# From project root
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/

# Verify it was created
docker images | grep bookstore-backend
```

### 4. **Test the Image Locally**

```bash
# Run the container
docker run -d -p 8080:8080 --name backend-test bookstore-backend:latest

# Test it
curl http://localhost:8080/
# Should return: "Backend is running"

# Check logs
docker logs backend-test

# Clean up
docker stop backend-test && docker rm backend-test
```

### 5. **Share the Image with Frontend Team**

**Option A: Push to Docker Hub** (Recommended)
```bash
# Tag your image
docker tag bookstore-backend:latest YOUR_USERNAME/bookstore-backend:latest

# Login to Docker Hub
docker login

# Push
docker push YOUR_USERNAME/bookstore-backend:latest

# Share this image name: YOUR_USERNAME/bookstore-backend:latest
```

**Option B: Save as Tar File**
```bash
# Save the image
docker save bookstore-backend:latest -o bookstore-backend.tar

# Compress (optional)
gzip bookstore-backend.tar

# Share the .tar or .tar.gz file with frontend team
```

---

## 📋 Requirements Checklist

- [x] Server runs on port 8080 (default)
- [x] Dockerfile created in `backend/` directory
- [ ] Image builds successfully
- [ ] Image runs and responds on port 8080
- [ ] All API routes under `/api/v1/` prefix (verify this)
- [ ] CORS allows frontend requests
- [ ] Image shared with frontend team

---

## 🔧 Environment Variables Your Backend Should Support

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | PostgreSQL connection | Required |
| `JWT_SECRET` | JWT secret key | Required |

---

## 📝 Frontend Integration

Once you share the image, the frontend team will:

1. Pull/load your image
2. Update `docker-compose.yml` to use: `image: YOUR_IMAGE_NAME`
3. Run: `docker-compose up -d backend`
4. Frontend connects to: `http://localhost:8080`

---

## 📚 Full Documentation

See `BACKEND_DOCKER_INSTRUCTIONS.md` for detailed instructions, troubleshooting, and advanced options.

---

## 🚨 Important Notes

- **Port 8080 is required** - Frontend is hardcoded to connect to `http://localhost:8080`
- **API paths** - Frontend expects routes under `/api/v1/` (e.g., `/api/v1/auth/login`)
- **CORS** - Must allow requests from frontend origin
- **Health check** - Consider adding a `/health` endpoint for docker health checks

---

## ❓ Questions?

Contact the frontend team or refer to:
- `BACKEND_DOCKER_INSTRUCTIONS.md` - Full detailed guide
- `DOCKER_BACKEND_GUIDE.md` - General Docker guide

