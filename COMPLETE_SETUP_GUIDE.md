# Complete BookStore Setup Guide

This guide sets up the complete BookStore application with all backend services and the frontend.

---

## Prerequisites

- Docker installed and running
- Terminal access (IntelliJ terminal or any terminal)

---

## Step 1: Create Network

```bash
docker network create bookstore-net
```

---

## Step 2: Start Postgres Database

```bash
docker rm -f onlinebookstore-db 2>$null; docker run -d --name onlinebookstore-db --network bookstore-net -p 5433:5432 -e POSTGRES_DB=onlinebookstore_db -e POSTGRES_USER=onlinebookstore_user -e POSTGRES_PASSWORD=onlinebookstore_pass postgres:17.6
```

**Database Details:**
- Port: `5433` (host) → `5432` (container)
- Database: `onlinebookstore_db`
- User: `onlinebookstore_user`
- Password: `onlinebookstore_pass`

---

## Step 3: Start MailHog (Email Service)

```bash
docker rm -f userservice-mailhog 2>$null; docker run -d --name userservice-mailhog --network bookstore-net -p 1025:1025 -p 8025:8025 mailhog/mailhog:latest
```

**MailHog UI:** http://localhost:8025 (for viewing emails)

---

## Step 4: Pull Backend Service Images

```bash
docker pull jacejnordgren/book-service:latest; docker pull jacejnordgren/user-service:latest; docker pull jacejnordgren/order-service:latest; docker pull jacejnordgren/cart-service:latest
```

---

## Step 5: Run Backend Services

### Book Service (Port 8080)

```bash
docker rm -f book-service 2>$null; docker run -d --name book-service --network bookstore-net -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass jacejnordgren/book-service:latest
```

### User Service (Port 8081)

```bash
docker rm -f user-service 2>$null; docker run -d --name user-service --network bookstore-net -p 8081:8081 -e SERVER_PORT=8081 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e SPRING_MAIL_HOST=userservice-mailhog -e SPRING_MAIL_PORT=1025 jacejnordgren/user-service:latest
```

### Cart Service (Port 8084)

```bash
docker rm -f cart-service 2>$null; docker run -d --name cart-service --network bookstore-net -p 8084:8084 -e SERVER_PORT=8084 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e BOOK_SERVICE_BASE_URL=http://book-service:8080 jacejnordgren/cart-service:latest
```

### Order Service (Port 8082)

```bash
docker rm -f order-service 2>$null; docker run -d --name order-service --network bookstore-net -p 8082:8082 -e SERVER_PORT=8082 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e EXTERNAL_BOOK_SERVICE_URL=http://book-service:8080 -e EXTERNAL_CART_SERVICE_URL=http://cart-service:8084 jacejnordgren/order-service:latest
```

---

## Step 6: Verify Backend Services

```bash
docker ps
```

You should see 6 containers running:
- `onlinebookstore-db` (PostgreSQL)
- `userservice-mailhog` (MailHog)
- `book-service` (Port 8080)
- `user-service` (Port 8081)
- `cart-service` (Port 8084)
- `order-service` (Port 8082)

---

## Step 7: Run Frontend

### Option A: Using Docker Image (Recommended)

```bash
# Pull the frontend image
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest

# Run the frontend
docker rm -f bookstore-frontend 2>$null; docker run -d --name bookstore-frontend --network bookstore-net -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8080 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

**Note:** Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username.

### Option B: Using Docker Compose

See `docker-compose.yml` for a complete setup with all services.

### Option C: Local Development

```bash
npm install
npm run dev
```

---

## Step 8: Access the Application

- **Frontend:** http://localhost:3000
- **Book Service API:** http://localhost:8080
- **User Service API:** http://localhost:8081
- **Order Service API:** http://localhost:8082
- **Cart Service API:** http://localhost:8084
- **MailHog UI:** http://localhost:8025
- **Database:** localhost:5433

---

## Service Ports Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Book Service | 8080 | http://localhost:8080 |
| User Service | 8081 | http://localhost:8081 |
| Order Service | 8082 | http://localhost:8082 |
| Cart Service | 8084 | http://localhost:8084 |
| MailHog UI | 8025 | http://localhost:8025 |
| MailHog SMTP | 1025 | - |
| PostgreSQL | 5433 | localhost:5433 |

---

## Troubleshooting

### Services Not Starting

```bash
# Check container logs
docker logs book-service
docker logs user-service
docker logs cart-service
docker logs order-service
```

### Network Issues

```bash
# Verify network exists
docker network ls | grep bookstore-net

# Inspect network
docker network inspect bookstore-net
```

### Port Conflicts

If a port is already in use:

```bash
# Find what's using the port (example for port 8080)
lsof -i :8080

# Or on Windows
netstat -ano | findstr :8080
```

### Restart All Services

```bash
# Stop all containers
docker stop onlinebookstore-db userservice-mailhog book-service user-service cart-service order-service bookstore-frontend

# Start all containers (run steps 2-7 again)
```

### Clean Up Everything

```bash
# Stop and remove all containers
docker stop onlinebookstore-db userservice-mailhog book-service user-service cart-service order-service bookstore-frontend
docker rm onlinebookstore-db userservice-mailhog book-service user-service cart-service order-service bookstore-frontend

# Remove network
docker network rm bookstore-net
```

---

## Quick Start (All-in-One)

Copy and paste this entire block to set up everything at once:

```bash
# 1. Create network
docker network create bookstore-net

# 2. Start database
docker rm -f onlinebookstore-db 2>$null; docker run -d --name onlinebookstore-db --network bookstore-net -p 5433:5432 -e POSTGRES_DB=onlinebookstore_db -e POSTGRES_USER=onlinebookstore_user -e POSTGRES_PASSWORD=onlinebookstore_pass postgres:17.6

# 3. Start MailHog
docker rm -f userservice-mailhog 2>$null; docker run -d --name userservice-mailhog --network bookstore-net -p 1025:1025 -p 8025:8025 mailhog/mailhog:latest

# 4. Pull backend images
docker pull jacejnordgren/book-service:latest; docker pull jacejnordgren/user-service:latest; docker pull jacejnordgren/order-service:latest; docker pull jacejnordgren/cart-service:latest

# 5. Start backend services
docker rm -f book-service 2>$null; docker run -d --name book-service --network bookstore-net -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass jacejnordgren/book-service:latest

docker rm -f user-service 2>$null; docker run -d --name user-service --network bookstore-net -p 8081:8081 -e SERVER_PORT=8081 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e SPRING_MAIL_HOST=userservice-mailhog -e SPRING_MAIL_PORT=1025 jacejnordgren/user-service:latest

docker rm -f cart-service 2>$null; docker run -d --name cart-service --network bookstore-net -p 8084:8084 -e SERVER_PORT=8084 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e BOOK_SERVICE_BASE_URL=http://book-service:8080 jacejnordgren/cart-service:latest

docker rm -f order-service 2>$null; docker run -d --name order-service --network bookstore-net -p 8082:8082 -e SERVER_PORT=8082 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e EXTERNAL_BOOK_SERVICE_URL=http://book-service:8080 -e EXTERNAL_CART_SERVICE_URL=http://cart-service:8084 jacejnordgren/order-service:latest

# 6. Verify
docker ps

# 7. Start frontend (replace YOUR_DOCKERHUB_USERNAME)
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
docker rm -f bookstore-frontend 2>$null; docker run -d --name bookstore-frontend --network bookstore-net -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8080 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

---

## Next Steps

1. Wait for all services to start (may take 30-60 seconds)
2. Open http://localhost:3000 in your browser
3. Test the application functionality
4. Check MailHog at http://localhost:8025 for email verification

---

## Notes

- The frontend expects the book service API at `http://localhost:8080`
- All services communicate via the `bookstore-net` Docker network
- Database is accessible on port `5433` (not the default 5432)
- MailHog captures all emails sent by the user service

