# BookStore Frontend - Docker Image Instructions

## Quick Start

The frontend is available as a pre-built Docker image. No source code or build steps required!

### Pull and Run

```bash
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

docker run -d -p 3000:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

The frontend will be available at: **http://localhost:3000**

---

## Configuration

### Backend API URL

The frontend expects the backend API at: **`http://localhost:8080`**

If your backend is running on a different host/port, you can configure it using environment variables when building (requires rebuilding the image) or by using a reverse proxy.

### Default Configuration

- **Frontend Port:** 3000 (mapped to host port 3000)
- **Backend API:** `http://localhost:8080`
- **API Path Prefix:** `/api/v1/`

---

## Docker Commands

### Start the Container

```bash
docker run -d -p 3000:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

### Stop the Container

```bash
docker stop bookstore-frontend
```

### Start a Stopped Container

```bash
docker start bookstore-frontend
```

### Remove the Container

```bash
docker rm bookstore-frontend
```

### View Logs

```bash
docker logs bookstore-frontend
```

### Restart the Container

```bash
docker restart bookstore-frontend
```

---

## Using a Different Port

If port 3000 is already in use, map to a different port:

```bash
docker run -d -p 8081:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

Then access at: `http://localhost:8081`

---

## Using Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
    container_name: bookstore-frontend
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

---

## Requirements

- **Docker** installed on your system
- **Backend service** running on `http://localhost:8080` (or configure accordingly)
- **Internet connection** to pull the image (first time only)

---

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Use a different port
docker run -d -p 8081:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

### Container Won't Start

```bash
# Check logs
docker logs bookstore-frontend

# Check container status
docker ps -a
```

### Image Not Found

```bash
# Make sure you've pulled the image
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Verify image exists
docker images | grep bookstore-frontend
```

### Backend Connection Issues

- Ensure backend is running on port 8080
- Check backend CORS settings allow requests from frontend origin
- Verify network connectivity between containers (if using docker-compose)

---

## Image Details

- **Image Name:** `YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest`
- **Base Image:** node:18-alpine
- **Frontend Framework:** Next.js 14
- **Port:** 3000 (inside container)
- **Size:** ~200-300 MB (compressed)

---

## Support

For issues or questions, contact the frontend team or refer to the project repository.

