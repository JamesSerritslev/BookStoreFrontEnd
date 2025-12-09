# How to Publish Frontend Docker Image to Docker Hub

Follow these steps to publish your frontend as a Docker image that other teams can easily use.

**⚠️ IMPORTANT:** Build from the **root directory** using the root `Dockerfile` (builds Next.js app), NOT from `frontend/Dockerfile` (builds basic Vite template).

---

## Prerequisites

1. **Docker installed** on your machine
2. **Docker Hub account** (create one at https://hub.docker.com if you don't have one)
3. **Next.js frontend code** ready in the project root directory
4. **Docker Buildx** for multi-platform builds (included in Docker Desktop)

---

## Step-by-Step Instructions

### Step 1: Setup Buildx for Multi-Platform (One-Time Setup)

```bash
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap
```

This enables building for multiple platforms (AMD64 and ARM64).

---

### Step 2: Build and Push Multi-Platform Image

**Login to Docker Hub first:**
```bash
docker login
```

**Build and push for multiple platforms:**
```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
  --push \
  .
```

**Note:** 
- Builds from the **root directory** (`.`)
- Uses the root `Dockerfile` which builds the **Next.js bookstore app**
- Creates images for both AMD64 and ARM64 platforms
- Pushes directly to Docker Hub

**Alternative (single platform, for testing):**
```bash
docker build -t bookstore-frontend:latest .
```

This creates a local Docker image named `bookstore-frontend:latest`.

**Verify it was created:**
```bash
docker images | grep bookstore-frontend
```

---

### Step 2: Tag the Image for Docker Hub

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```bash
docker tag bookstore-frontend:latest YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

**Example:**
```bash
docker tag bookstore-frontend:latest johndoe/bookstore-frontend:latest
```

**Optional:** Tag with a version number as well:
```bash
docker tag bookstore-frontend:latest YOUR_DOCKERHUB_USERNAME/bookstore-frontend:v1.0.0
```

---

### Step 3: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

**Alternative:** Login with username directly:
```bash
docker login -u YOUR_DOCKERHUB_USERNAME
```

---

### Step 4: Push to Docker Hub

```bash
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

**Example:**
```bash
docker push johndoe/bookstore-frontend:latest
```

If you tagged a version:
```bash
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:v1.0.0
```

**Note:** First push may take a few minutes depending on your internet connection.

---

### Step 4: Verify on Docker Hub

1. Go to https://hub.docker.com
2. Navigate to your repositories
3. You should see `bookstore-frontend` listed
4. Click on it to see the image details

---

### Step 5: Make Repository Public (Important!)

1. Go to your repository on Docker Hub
2. Click on **Settings** (or the gear icon)
3. Under **Repository Visibility**, select **Public**
4. Save changes

This allows other teams to pull your image without authentication.

---

## Quick Reference Commands

```bash
# 1. Setup buildx (one-time)
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap

# 2. Login
docker login

# 3. Build and push (multi-platform)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
  --push \
  .

# 4. Verify
docker manifest inspect YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

---

## Updating the Image

When you make changes to the frontend:

1. **Rebuild and push (multi-platform):**
   ```bash
   docker login
   docker buildx build \
     --platform linux/amd64,linux/arm64 \
     -t YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest \
     --push \
     .
   ```

**Note:** Docker will only push the changed layers, so updates are usually faster.

**Note:** Docker will only push the changed layers, so updates are usually faster.

---

## Testing Before Publishing

Test the image locally before pushing:

```bash
# Build locally first (single platform for testing)
docker build -t bookstore-frontend:latest .

# Run the image
docker run -d -p 3000:3000 --name test-frontend bookstore-frontend:latest

# Test it
curl http://localhost:3000
# Or open http://localhost:3000 in your browser
# Should show the bookstore app, NOT the basic Vite template

# Clean up
docker stop test-frontend
docker rm test-frontend
```

---

## Sharing with Other Teams

Once published, share these instructions with other teams:

**File to share:** `FRONTEND_DOCKER_IMAGE_INSTRUCTIONS.md` or `README_DOCKER_IMAGE.md`

**Quick instructions:**
```bash
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
docker run -d -p 80:80 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

---

## Troubleshooting

### Authentication Failed

```bash
# Try logging in again
docker logout
docker login
```

### Permission Denied

- Make sure you're logged in: `docker login`
- Verify your Docker Hub username is correct
- Check that the repository name matches your username

### Push Takes Too Long

- Check your internet connection
- First push includes all layers and takes longer
- Subsequent pushes only include changes

### Image Not Found After Push

- Wait a few minutes for Docker Hub to process
- Refresh the Docker Hub page
- Check the repository visibility is set to **Public**

---

## Best Practices

1. **Use semantic versioning:**
   ```bash
   docker tag bookstore-frontend:latest YOUR_USERNAME/bookstore-frontend:v1.0.0
   docker push YOUR_USERNAME/bookstore-frontend:v1.0.0
   ```

2. **Keep `latest` tag updated:**
   - Always push to `latest` for the most recent version
   - Also tag specific versions for stability

3. **Add description on Docker Hub:**
   - Go to your repository
   - Click **Edit** to add a description
   - Include brief usage instructions

4. **Test before publishing:**
   - Always test the image locally first
   - Verify it works as expected

---

## Next Steps

After publishing:

1. ✅ Share `FRONTEND_DOCKER_IMAGE_INSTRUCTIONS.md` with other teams
2. ✅ Update your project README with the Docker Hub image name
3. ✅ Document any configuration requirements
4. ✅ Set up automated builds (optional, for CI/CD)

---

## Example Complete Workflow

```bash
# Setup buildx (one-time)
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap

# Login
docker login

# Build and push (multi-platform)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t johndoe/bookstore-frontend:latest \
  --push \
  .

# Test (on another machine - works on both AMD64 and ARM64)
docker pull johndoe/bookstore-frontend:latest
docker run -d -p 3000:3000 --name frontend johndoe/bookstore-frontend:latest
```

---

**Your Docker Hub image will be:** `YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest`

