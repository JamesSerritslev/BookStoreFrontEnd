# Publishing Frontend Docker Image to Docker Hub

## Step 1: Build the Docker Image

```bash
cd BookStoreFrontEnd
docker build -t bookstore-frontend:latest ./frontend
```

## Step 2: Tag for Docker Hub

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```bash
docker tag bookstore-frontend:latest YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

You can also tag with a version number:

```bash
docker tag bookstore-frontend:latest YOUR_DOCKERHUB_USERNAME/bookstore-frontend:v1.0.0
```

## Step 3: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

## Step 4: Push to Docker Hub

```bash
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

If you tagged a version:

```bash
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:v1.0.0
```

## Step 5: Verify

Check your Docker Hub repository: `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/bookstore-frontend`

## Quick Reference

```bash
# Build
docker build -t bookstore-frontend:latest ./frontend

# Tag
docker tag bookstore-frontend:latest YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Login
docker login

# Push
docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

## Updating the Image

When you make changes:

1. Rebuild: `docker build -t bookstore-frontend:latest ./frontend`
2. Retag: `docker tag bookstore-frontend:latest YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest`
3. Push: `docker push YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest`

