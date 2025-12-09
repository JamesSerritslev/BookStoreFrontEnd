# Quick Start - BookStore Application

## One-Line Setup Commands

Copy and paste each command into your terminal (one at a time):

### 1. Create Network
```bash
docker network create bookstore-net
```

### 2. Start Database
```bash
docker rm -f onlinebookstore-db 2>$null; docker run -d --name onlinebookstore-db --network bookstore-net -p 5433:5432 -e POSTGRES_DB=onlinebookstore_db -e POSTGRES_USER=onlinebookstore_user -e POSTGRES_PASSWORD=onlinebookstore_pass postgres:17.6
```

### 3. Start MailHog
```bash
docker rm -f userservice-mailhog 2>$null; docker run -d --name userservice-mailhog --network bookstore-net -p 1025:1025 -p 8025:8025 mailhog/mailhog:latest
```

### 4. Pull Backend Images
```bash
docker pull jacejnordgren/book-service:latest; docker pull jacejnordgren/user-service:latest; docker pull jacejnordgren/order-service:latest; docker pull jacejnordgren/cart-service:latest
```

### 5. Start Book Service
```bash
docker rm -f book-service 2>$null; docker run -d --name book-service --network bookstore-net -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass jacejnordgren/book-service:latest
```

### 6. Start User Service
```bash
docker rm -f user-service 2>$null; docker run -d --name user-service --network bookstore-net -p 8081:8081 -e SERVER_PORT=8081 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e SPRING_MAIL_HOST=userservice-mailhog -e SPRING_MAIL_PORT=1025 jacejnordgren/user-service:latest
```

### 7. Start Cart Service
```bash
docker rm -f cart-service 2>$null; docker run -d --name cart-service --network bookstore-net -p 8084:8084 -e SERVER_PORT=8084 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e BOOK_SERVICE_BASE_URL=http://book-service:8080 jacejnordgren/cart-service:latest
```

### 8. Start Order Service
```bash
docker rm -f order-service 2>$null; docker run -d --name order-service --network bookstore-net -p 8082:8082 -e SERVER_PORT=8082 -e SPRING_DATASOURCE_URL=jdbc:postgresql://onlinebookstore-db:5432/onlinebookstore_db -e SPRING_DATASOURCE_USERNAME=onlinebookstore_user -e SPRING_DATASOURCE_PASSWORD=onlinebookstore_pass -e EXTERNAL_BOOK_SERVICE_URL=http://book-service:8080 -e EXTERNAL_CART_SERVICE_URL=http://cart-service:8084 jacejnordgren/order-service:latest
```

### 9. Verify Services
```bash
docker ps
```

You should see 6 containers: `onlinebookstore-db`, `userservice-mailhog`, `book-service`, `user-service`, `cart-service`, `order-service`

### 10. Start Frontend
```bash
docker pull YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
docker rm -f bookstore-frontend 2>$null; docker run -d --name bookstore-frontend --network bookstore-net -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8080 YOUR_DOCKERHUB_USERNAME/bookstore-frontend:latest
```

**Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username.**

---

## Access the Application

- **Frontend:** http://localhost:3000
- **MailHog UI:** http://localhost:8025

---

## Using Docker Compose (Alternative)

If you prefer using docker-compose:

1. Update `docker-compose.full.yml` with your Docker Hub username
2. Run: `docker-compose -f docker-compose.full.yml up -d`

---

## Troubleshooting

### Check Service Logs
```bash
docker logs book-service
docker logs user-service
docker logs cart-service
docker logs order-service
docker logs bookstore-frontend
```

### Restart a Service
```bash
docker restart book-service
```

### Stop All Services
```bash
docker stop onlinebookstore-db userservice-mailhog book-service user-service cart-service order-service bookstore-frontend
```

### Remove All Services
```bash
docker rm -f onlinebookstore-db userservice-mailhog book-service user-service cart-service order-service bookstore-frontend
docker network rm bookstore-net
```

