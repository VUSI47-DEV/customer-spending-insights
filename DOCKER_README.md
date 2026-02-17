# Next.js Docker Project

A production-ready Next.js application containerized with Docker, using multi-stage builds for optimal image size and security.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (optional, for easier development)
- Node.js 22+ and pnpm (for local development without Docker)

## Project Structure

```
.
├── Dockerfile          # Multi-stage Docker build configuration
├── package.json        # Project dependencies and scripts
├── pnpm-lock.yaml      # Locked dependency versions
├── next.config.ts      # Next.js configuration (ensure output: 'standalone')
├── app/                # Next.js App Router source (pages under app/)
├── components/         # Reusable React components
├── lib/                # Shared libraries and utilities
├── public/             # Static assets
└── .dockerignore       # Files to exclude from Docker build context (recommended)
```

## Getting Started

### Building the Docker Image

Build the production image:

```bash
docker build -t nextjs-app:latest .
```

Build with a specific tag:

```bash
docker build -t nextjs-app:v1.0.0 .
```

Build with build arguments (if needed):

```bash
docker build --build-arg NODE_ENV=production -t nextjs-app:latest .
```

### Running the Container

Run the container in detached mode:

```bash
docker run -d -p 3000:3000 --name nextjs-container nextjs-app:latest
```

Run with environment variables:

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e API_KEY="your-api-key" \
  --name nextjs-container \
  nextjs-app:latest
```

Run with volume mounting for logs or data:

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  --name nextjs-container \
  nextjs-app:latest
```

### Accessing the Application

Once running, access the application at:

```
http://localhost:3000
```

## Docker Compose (Optional)

Create a `docker-compose.yml` file for easier management:

```yaml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Then use these commands:

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Testing

### Test the Docker Build

Verify the image builds successfully:

```bash
docker build -t nextjs-app:test .
```

### Test the Running Container

1. **Start the container:**
   ```bash
   docker run -d -p 3000:3000 --name test-container nextjs-app:latest
   ```

2. **Check container health:**
   ```bash
   docker ps
   docker logs test-container
   ```

3. **Test the application:**
   ```bash
   curl http://localhost:3000
   ```

4. **Verify security (non-root user):**
   ```bash
   docker exec test-container whoami
   # Should output: nextjs
   ```

5. **Check image size:**
   ```bash
   docker images nextjs-app:latest
   ```

6. **Cleanup:**
   ```bash
   docker stop test-container
   docker rm test-container
   ```

### Load Testing (Optional)

Using Apache Bench:

```bash
ab -n 1000 -c 10 http://localhost:3000/
```

Using curl for a simple health check:

```bash
for i in {1..10}; do
  curl -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" http://localhost:3000/
  sleep 1
done
```

## Container Management

### View running containers:
```bash
docker ps
```

### View container logs:
```bash
docker logs nextjs-container
docker logs -f nextjs-container  # Follow logs
docker logs --tail 100 nextjs-container  # Last 100 lines
```

### Stop the container:
```bash
docker stop nextjs-container
```

### Start a stopped container:
```bash
docker start nextjs-container
```

### Remove the container:
```bash
docker rm nextjs-container
docker rm -f nextjs-container  # Force remove running container
```

### Remove the image:
```bash
docker rmi nextjs-app:latest
```

### Execute commands inside the container:
```bash
docker exec -it nextjs-container sh
docker exec nextjs-container node -v
```

## Development Workflow

### Local Development (without Docker)

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Development with Docker

Create a `Dockerfile.dev`:

```dockerfile
FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
```

Run development container:

```bash
docker build -f Dockerfile.dev -t nextjs-app:dev .
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules nextjs-app:dev
```

## Configuration

### Next.js Configuration

Ensure your `next.config.ts` includes (TypeScript example):

```typescript
const nextConfig = {
  output: 'standalone',
  // ... other config
}

export default nextConfig
```

### Docker Ignore

Create a `.dockerignore` file:

```
node_modules
.next
.git
.gitignore
README.md
.env*.local
.vscode
.idea
*.log
npm-debug.log*
.DS_Store
coverage
.cache
```

### Environment Variables

Create a `.env.example` file:

```
DATABASE_URL=
API_KEY=
NEXT_PUBLIC_API_URL=
```

Pass environment variables at runtime:

```bash
docker run -d -p 3000:3000 --env-file .env nextjs-app:latest
```

## Troubleshooting

### Container won't start
```bash
docker logs nextjs-container
```

### Port already in use
```bash
# Use a different port
docker run -d -p 3001:3000 nextjs-app:latest
```

### Build fails
```bash
# Clean Docker cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t nextjs-app:latest .
```

### Check container resource usage
```bash
docker stats nextjs-container
```

### Access container filesystem
```bash
docker exec -it nextjs-container sh
ls -la /app
```

## Production Deployment

### Push to Docker Registry

```bash
# Docker Hub
docker tag nextjs-app:latest username/nextjs-app:latest
docker push username/nextjs-app:latest

# GitHub Container Registry
docker tag nextjs-app:latest ghcr.io/username/nextjs-app:latest
docker push ghcr.io/username/nextjs-app:latest
```

### Deploy to Cloud Platforms

**AWS ECS, Google Cloud Run, Azure Container Instances:**
- Build and push image to registry
- Configure service with image URL
- Set environment variables
- Configure auto-scaling and health checks




