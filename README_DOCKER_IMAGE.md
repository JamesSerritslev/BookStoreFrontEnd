# BookStore Frontend - Docker Image

## Quick Start

Pull and run the frontend Docker image:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

docker run -d -p 3000:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

**Access the frontend at:** http://localhost:3000

---

## Requirements

- Docker installed
- Backend API running at `http://localhost:8080`

---

## Configuration

The frontend expects the backend API at **`http://localhost:8080`**.

---

## Commands

```bash
# Start
docker run -d -p 3000:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Stop
docker stop bookstore-frontend

# Start again
docker start bookstore-frontend

# Remove
docker rm bookstore-frontend

# View logs
docker logs bookstore-frontend
```

---

## Using Different Port

If port 3000 is in use:

```bash
docker run -d -p 8081:3000 --name bookstore-frontend YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

Access at: `http://localhost:8081`

---

## Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    image: YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

```bash
docker-compose up -d
```

---

**Image:** `YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest`  
**Port:** 3000  
**Backend API:** http://localhost:8080

