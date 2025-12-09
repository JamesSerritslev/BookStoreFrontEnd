# ⚠️ URGENT: Rebuild and Republish Docker Image

## Issues Found

1. **Wrong Dockerfile Used** - Image was built from `frontend/Dockerfile` (basic Vite template) instead of root `Dockerfile` (Next.js bookstore app)
2. **ARM64 Only** - Image only supports ARM64, not AMD64 (causes "no matching manifest" errors)

## Solution

Rebuild using the **root Dockerfile** with **multi-platform support**.

---

## Step-by-Step Fix

### 1. Setup Buildx (One-Time)

```bash
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap
```

### 2. Login to Docker Hub

```bash
docker login
```

### 3. Build and Push Multi-Platform Image

**⚠️ CRITICAL: Build from ROOT directory (`.`), NOT from `./frontend`**

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
  --push \
  .
```

**Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username (e.g., `cacho003`)**

### 4. Verify

```bash
# Check manifest includes both platforms
docker manifest inspect YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

You should see both:
- `linux/amd64`
- `linux/arm64`

### 5. Test Locally (Optional)

```bash
# Pull the new image
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Run it
docker run -d -p 3000:3000 --name test-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Check it shows the bookstore app (not Vite template)
curl http://localhost:3000
# Or open http://localhost:3000 in browser
```

---

## What This Fixes

✅ **Correct Application** - Builds Next.js bookstore app (not Vite template)  
✅ **Multi-Platform** - Works on both AMD64 and ARM64  
✅ **No More Errors** - Backend teams won't see "no matching manifest" errors  

---

## Quick Command (Copy-Paste Ready)

Replace `cacho003` with your Docker Hub username:

```bash
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap
docker login
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t cacho003/bookstore-frontend:latest \
  --push \
  .
```

---

## After Republishing

Notify the backend team to pull the updated image:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
docker run -d -p 3000:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

They should now see:
- ✅ Works on AMD64 machines (no platform errors)
- ✅ Shows the actual bookstore application (not Vite template)
- ✅ Runs on port 3000

---

## Verification Checklist

- [ ] Built from root directory (`.`)
- [ ] Used root `Dockerfile` (not `frontend/Dockerfile`)
- [ ] Built for both `linux/amd64` and `linux/arm64`
- [ ] Pushed to Docker Hub
- [ ] Verified manifest shows both platforms
- [ ] Tested locally - shows bookstore app (not Vite)
- [ ] Notified backend team to pull updated image

