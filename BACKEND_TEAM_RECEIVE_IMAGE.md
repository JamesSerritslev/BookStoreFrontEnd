# Instructions for Backend Team: Receiving and Using the Docker Image

The frontend team has built a Docker image for the backend service. Here's how to receive and use it.

---

## 📦 Option A: Receive Tar File (If Frontend Sent a .tar or .tar.gz file)

### Step 1: Receive the File
- Get `bookstore-backend.tar` or `bookstore-backend.tar.gz` from frontend team
- Save it to your local machine

### Step 2: Load the Image

**If uncompressed (.tar):**
```bash
docker load -i bookstore-backend.tar
```

**If compressed (.tar.gz):**
```bash
gunzip -c bookstore-backend.tar.gz | docker load
# OR
docker load < bookstore-backend.tar.gz
```

### Step 3: Verify Image Loaded
```bash
docker images | grep bookstore-backend
```

You should see: `bookstore-backend:latest`

---

## 📥 Option B: Pull from Docker Hub (If Frontend Pushed to Docker Hub)

### Step 1: Pull the Image
```bash
docker pull YOUR_USERNAME/bookstore-backend:latest
```

Replace `YOUR_USERNAME` with the actual Docker Hub username provided by frontend team.

### Step 2: Tag it Locally (Optional)
```bash
docker tag YOUR_USERNAME/bookstore-backend:latest bookstore-backend:latest
```

---

## 🧪 Test the Image

### Run the Container
```bash
docker run -d \
  --name backend-test \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  bookstore-backend:latest
```

### Test the API
```bash
curl http://localhost:8080/
```

Should return: `"Backend is running"`

### Check Logs
```bash
docker logs backend-test
```

### Clean Up Test Container
```bash
docker stop backend-test
docker rm backend-test
```

---

## 🚀 Use in Your docker-compose.yml

Add this to your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: bookstore-backend:latest  # The image you received
    container_name: backend
    ports:
      - "8080:8080"  # Frontend expects port 8080
    environment:
      - NODE_ENV=production
      - PORT=8080
      - DATABASE_URL=postgresql://user:password@database:5432/bookstore
      - JWT_SECRET=your-secret-key-here
    depends_on:
      - database
    networks:
      - app-network
    volumes:
      - ./uploads:/app/uploads  # Persist uploads if needed
    restart: unless-stopped

  database:
    image: postgres:15-alpine
    container_name: database
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=bookstore
    volumes:
      - postgres-data:/var/lib/postgresql/data
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

### Start the Services
```bash
docker-compose up -d backend
```

---

## 📋 Image Details

- **Image Name:** `bookstore-backend:latest`
- **Port:** 8080 (required - frontend expects this)
- **Runtime:** Node.js 18
- **Base Image:** node:18-alpine
- **Working Directory:** /app
- **Start Command:** `node server.js`

---

## 🔧 Environment Variables

The image supports these environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8080` | No |
| `NODE_ENV` | Environment | `production` | No |
| `DATABASE_URL` | PostgreSQL connection | - | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |

---

## 🔍 Extract Code from Image (If Needed)

If you need to see or modify the code inside the image:

```bash
# Create a temporary container
docker create --name temp-container bookstore-backend:latest

# Copy files from container
docker cp temp-container:/app ./extracted-backend

# Clean up
docker rm temp-container
```

---

## ✅ Verification Checklist

- [ ] Image loaded/pulled successfully
- [ ] Image appears in `docker images`
- [ ] Container runs on port 8080
- [ ] API responds at `http://localhost:8080/`
- [ ] docker-compose.yml configured correctly
- [ ] Environment variables set
- [ ] Database connection configured

---

## 🐛 Troubleshooting

### Image Not Found
```bash
# Check if image exists
docker images | grep bookstore-backend

# If not found, verify you loaded/pulled correctly
```

### Port Already in Use
```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker logs backend

# Run interactively to debug
docker run -it --rm bookstore-backend:latest sh
```

### Database Connection Issues
- Ensure database service is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/dbname`
- Verify containers are on same network

---

## 📞 Next Steps

1. Load/pull the image
2. Test it locally
3. Configure your docker-compose.yml
4. Set environment variables
5. Start services: `docker-compose up -d`
6. Frontend will connect to: `http://localhost:8080`

---

## 📝 Notes

- The image is pre-configured to run on port 8080
- All dependencies are included in the image
- The image is production-ready
- You can modify environment variables via docker-compose.yml
- Uploads directory is at `/app/uploads` inside container

---

## 🎯 Quick Reference

```bash
# Load from tar
docker load -i bookstore-backend.tar

# Pull from Docker Hub
docker pull YOUR_USERNAME/bookstore-backend:latest

# Test
docker run -d -p 8080:8080 --name test bookstore-backend:latest
curl http://localhost:8080/

# Use in docker-compose
docker-compose up -d backend
```

