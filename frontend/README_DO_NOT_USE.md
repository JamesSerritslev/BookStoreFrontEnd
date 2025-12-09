# ⚠️ DO NOT USE THIS DOCKERFILE

This `frontend/Dockerfile` builds a **basic Vite template**, NOT the actual bookstore application.

## Use the Root Dockerfile Instead

The correct Dockerfile is in the **root directory** (`/Dockerfile`), which builds the **Next.js bookstore application**.

### Correct Build Command:

```bash
# From project root
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
  --push \
  .
```

**NOT:**
```bash
# ❌ WRONG - This builds the basic Vite template
docker build -t bookstore-frontend ./frontend
```

---

## Why This File Exists

This directory contains a separate Vite project that is not part of the main bookstore application. The actual bookstore frontend is a Next.js application in the root directory.

---

## If You See the Basic Vite App

If you pulled an image and see the basic Vite/React starter (with vite.svg logo), it means the image was built from this wrong Dockerfile. 

**Solution:** Rebuild using the root Dockerfile and republish.

