# How to Share Docker Image with Backend Team

Since the backend team doesn't have access to this project, you need to build the Docker image and share it with them.

---

## Step 1: Build the Docker Image

From the project root directory, run:

```bash
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/
```

This will create a Docker image named `bookstore-backend:latest`.

**Verify it was created:**
```bash
docker images | grep bookstore-backend
```

---

## Step 2: Choose How to Share

### Option A: Save as Tar File (Easiest - Recommended)

**Save the image:**
```bash
docker save bookstore-backend:latest -o bookstore-backend.tar
```

**Compress it (optional but recommended for smaller file size):**
```bash
gzip bookstore-backend.tar
```

**Share the file:**
- Send `bookstore-backend.tar` or `bookstore-backend.tar.gz` to backend team
- Via email, shared drive, file transfer service, etc.

**File size:** Typically 100-500 MB (compressed: 50-200 MB)

---

### Option B: Push to Docker Hub (Best for Ongoing Updates)

**1. Create Docker Hub account** (if you don't have one): https://hub.docker.com

**2. Tag your image:**
```bash
docker tag bookstore-backend:latest YOUR_USERNAME/bookstore-backend:latest
```

**3. Login to Docker Hub:**
```bash
docker login
```

**4. Push the image:**
```bash
docker push YOUR_USERNAME/bookstore-backend:latest
```

**5. Share with backend team:**
- Image name: `YOUR_USERNAME/bookstore-backend:latest`
- They can pull it with: `docker pull YOUR_USERNAME/bookstore-backend:latest`

---

### Option C: Use Private Registry

If your organization has a private Docker registry:
```bash
docker tag bookstore-backend:latest registry.example.com/bookstore-backend:latest
docker push registry.example.com/bookstore-backend:latest
```

---

## Step 3: Give Backend Team These Instructions

Share the file **`BACKEND_TEAM_RECEIVE_IMAGE.md`** (created below) with them, along with:
- The tar file (if using Option A), OR
- The Docker Hub image name (if using Option B)

---

## Quick Commands Summary

```bash
# Build
docker build -t bookstore-backend:latest -f backend/Dockerfile backend/

# Save as tar (Option A)
docker save bookstore-backend:latest -o bookstore-backend.tar
gzip bookstore-backend.tar  # Optional compression

# Push to Docker Hub (Option B)
docker tag bookstore-backend:latest YOUR_USERNAME/bookstore-backend:latest
docker login
docker push YOUR_USERNAME/bookstore-backend:latest
```

---

## What's Included in the Image

The Docker image contains:
- Node.js 18 runtime
- All backend code (server.js, routes, etc.)
- Production dependencies (from package.json)
- Configured to run on port 8080
- Uploads directory structure

The backend team can use this image directly or extract the code if needed.

