# Quick Start: Share Docker Image with Backend Team

## What to Give Backend Team

Since they don't have this project, give them:

1. **The Docker image file** (see options below)
2. **The instructions file**: `BACKEND_TEAM_RECEIVE_IMAGE.md`

---

## 🚀 Quick Steps (Choose One Method)

### Method 1: Tar File (Easiest)

```bash
# 1. Build the image
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/

# 2. Save as tar file
docker save bookstore-backend:latest -o bookstore-backend.tar

# 3. Compress (optional but recommended)
gzip bookstore-backend.tar
```

**Give backend team:**
- ✅ `bookstore-backend.tar.gz` (or `.tar` if not compressed)
- ✅ `BACKEND_TEAM_RECEIVE_IMAGE.md`

---

### Method 2: Docker Hub (Best for Updates)

```bash
# 1. Build the image
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/

# 2. Tag for Docker Hub (replace YOUR_USERNAME)
docker tag bookstore-backend:latest YOUR_USERNAME/bookstore-backend:latest

# 3. Login to Docker Hub
docker login

# 4. Push
docker push YOUR_USERNAME/bookstore-backend:latest
```

**Give backend team:**
- ✅ Docker Hub image name: `YOUR_USERNAME/bookstore-backend:latest`
- ✅ `BACKEND_TEAM_RECEIVE_IMAGE.md`

---

## 📧 What to Send Backend Team

### If Using Tar File:
```
Subject: Backend Docker Image

Hi Backend Team,

I've built the Docker image for the backend service. Please find:

1. bookstore-backend.tar.gz - The Docker image file
2. BACKEND_TEAM_RECEIVE_IMAGE.md - Instructions on how to load and use it

The image is configured to run on port 8080 (as required by the frontend).

Let me know if you have any questions!

Thanks!
```

### If Using Docker Hub:
```
Subject: Backend Docker Image on Docker Hub

Hi Backend Team,

I've pushed the Docker image to Docker Hub. Here's what you need:

1. Image name: YOUR_USERNAME/bookstore-backend:latest
2. BACKEND_TEAM_RECEIVE_IMAGE.md - Instructions on how to pull and use it

To pull the image:
  docker pull YOUR_USERNAME/bookstore-backend:latest

The image is configured to run on port 8080 (as required by the frontend).

Let me know if you have any questions!

Thanks!
```

---

## ✅ Checklist

- [ ] Built the Docker image
- [ ] Saved/pushed the image
- [ ] Sent image file OR Docker Hub name to backend team
- [ ] Sent `BACKEND_TEAM_RECEIVE_IMAGE.md` instructions
- [ ] Verified image works (tested locally)

---

## 🧪 Test Before Sending (Optional)

```bash
# Build
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/

# Test
docker run -d -p 8080:8080 --name test-backend bookstore-backend:latest

# Verify
curl http://localhost:8080/
# Should return: "Backend is running"

# Clean up
docker stop test-backend && docker rm test-backend
```

---

## 📝 File Sizes

- Uncompressed tar: ~200-500 MB
- Compressed tar.gz: ~50-200 MB
- Docker Hub: No file transfer needed (they pull it)

---

That's it! Once you send them the image and instructions, they can load it and use it in their docker-compose setup.

