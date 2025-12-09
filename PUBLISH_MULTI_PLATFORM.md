# Publishing Multi-Platform Docker Image

## Important: Build from Root Directory

**⚠️ CRITICAL:** You must build from the **root directory** using the root `Dockerfile`, NOT from `frontend/Dockerfile`.

The root `Dockerfile` builds the Next.js bookstore application.  
The `frontend/Dockerfile` builds a basic Vite template (wrong one - don't use it).

---

## Step 1: Build Multi-Platform Image

### Option A: Using Docker Buildx (Recommended)

**Enable buildx:**
```bash
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap
```

**Build for multiple platforms:**
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
  --push \
  .
```

This builds for both AMD64 (Intel/AMD) and ARM64 (Apple Silicon, newer servers) and pushes directly to Docker Hub.

---

### Option B: Build and Push Separately

**Build for AMD64 (most common):**
```bash
docker build --platform linux/amd64 -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-amd64 .
```

**Build for ARM64:**
```bash
docker build --platform linux/arm64 -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-arm64 .
```

**Tag and push both:**
```bash
docker tag YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-amd64 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
docker tag YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-arm64 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-arm64

docker login
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-amd64
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest-arm64
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

**Note:** This approach requires creating a manifest list for true multi-platform support. Use Option A instead.

---

## Step 2: Verify Multi-Platform Support

After pushing, verify the manifest:

```bash
docker manifest inspect YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

You should see both `linux/amd64` and `linux/arm64` in the manifest.

---

## Quick Reference (Recommended Method)

```bash
# 1. Setup buildx (one time)
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap

# 2. Login to Docker Hub
docker login

# 3. Build and push for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
  --push \
  .

# 4. Verify
docker manifest inspect YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

---

## Troubleshooting

### Buildx Not Available

If `docker buildx` is not available, update Docker Desktop or install buildx plugin:

```bash
# Install buildx plugin
mkdir -p ~/.docker/cli-plugins
curl -L https://github.com/docker/buildx/releases/latest/download/buildx-v0.11.2.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx
```

### Still Seeing Vite App

- **Make sure you're building from the root directory** (`.` not `./frontend`)
- **Verify you're using the root `Dockerfile`** (not `frontend/Dockerfile`)
- **Check the build output** - it should say "Building Next.js application"

### Platform-Specific Issues

If you need to test a specific platform locally:

```bash
# Test AMD64 on ARM Mac
docker run --platform linux/amd64 -d -p 3000:3000 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Test ARM64
docker run --platform linux/arm64 -d -p 3000:3000 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

---

## What Changed

1. ✅ **Root Dockerfile** - Builds Next.js app (not Vite)
2. ✅ **Multi-platform support** - Works on both AMD64 and ARM64
3. ✅ **Correct build context** - Builds from root directory (`.`)

---

## After Publishing

Other teams can now pull without platform issues:

```bash
# Works on both AMD64 and ARM64 automatically
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
docker run -d -p 3000:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

No more "no matching manifest" errors! ✅

