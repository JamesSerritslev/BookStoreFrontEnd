# Docker Backend Deployment Guide

This guide explains how to get a Docker image to your backend service.

## Overview

Your frontend expects the backend to run on `http://localhost:8080` (as configured in `lib/config.ts`). Here are several ways to deploy a Docker image for your backend.

---

## Method 1: Build Image from Dockerfile (Recommended)

If you have a backend codebase with a Dockerfile:

### Step 1: Build the Docker Image

```bash
# Navigate to your backend directory (if separate)
cd /path/to/backend

# Build the image with a tag
docker build -t bookstore-backend:latest .

# Or build with a specific version
docker build -t bookstore-backend:v1.0.0 .
```

### Step 2: Update docker-compose.yml

Uncomment and modify the backend service in `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: bookstore-backend:latest  # Use your built image
    container_name: backend
    ports:
      - "8080:8080"  # Match your frontend's expected port
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
    restart: unless-stopped

  database:
    image: postgres:15-alpine
    container_name: database
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypassword
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
```

### Step 3: Run with Docker Compose

```bash
# Start the backend (and database)
docker-compose up -d backend

# Or start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
```

---

## Method 2: Build Image Directly in docker-compose.yml

If your backend code is in a separate directory, you can configure docker-compose to build it:

```yaml
services:
  backend:
    build:
      context: ../backend  # Path to your backend directory
      dockerfile: Dockerfile
    container_name: backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
    networks:
      - app-network
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d --build backend
```

---

## Method 3: Pull Image from Docker Registry

If your backend image is already published to Docker Hub or another registry:

### Step 1: Pull the Image

```bash
# From Docker Hub
docker pull your-username/bookstore-backend:latest

# From a private registry
docker pull registry.example.com/bookstore-backend:latest
```

### Step 2: Update docker-compose.yml

```yaml
services:
  backend:
    image: your-username/bookstore-backend:latest  # Or registry URL
    container_name: backend
    ports:
      - "8080:8080"
    # ... rest of config
```

### Step 3: Run

```bash
docker-compose up -d backend
```

---

## Method 4: Load Image from a Tar File

If you have a Docker image saved as a `.tar` file:

### Step 1: Load the Image

```bash
docker load -i bookstore-backend.tar
```

### Step 2: Verify the Image

```bash
docker images | grep bookstore-backend
```

### Step 3: Use in docker-compose.yml

```yaml
services:
  backend:
    image: bookstore-backend:latest  # Use the loaded image name
    # ... rest of config
```

---

## Method 5: Save and Transfer Image

If you need to transfer an image from one machine to another:

### On Source Machine:

```bash
# Save the image to a tar file
docker save bookstore-backend:latest -o bookstore-backend.tar

# Or compress it
docker save bookstore-backend:latest | gzip > bookstore-backend.tar.gz
```

### Transfer the File:

```bash
# Using SCP
scp bookstore-backend.tar user@target-machine:/path/to/destination/

# Or using other methods (rsync, USB drive, etc.)
```

### On Target Machine:

```bash
# Load the image
docker load -i bookstore-backend.tar

# Or if compressed
gunzip -c bookstore-backend.tar.gz | docker load
```

---

## Quick Start: Example Backend Dockerfile

If you need to create a Dockerfile for a Node.js backend:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
# Or: CMD ["npm", "start"]
```

---

## Verification

After deploying, verify the backend is running:

```bash
# Check if container is running
docker ps | grep backend

# Check logs
docker logs backend

# Test the API endpoint
curl http://localhost:8080/api/v1/book

# Or test from your frontend
# The frontend should connect to http://localhost:8080
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8080
lsof -i :8080

# Or change the port mapping in docker-compose.yml
ports:
  - "8081:8080"  # Host:Container
```

### Image Not Found
```bash
# List all images
docker images

# Make sure the image name matches exactly in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Try running interactively
docker-compose run --rm backend sh
```

---

## Next Steps

1. **Update docker-compose.yml** with your backend configuration
2. **Set environment variables** for your backend (database URLs, secrets, etc.)
3. **Configure networking** so frontend can communicate with backend
4. **Set up volumes** if your backend needs persistent storage

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/) - Public registry for images

