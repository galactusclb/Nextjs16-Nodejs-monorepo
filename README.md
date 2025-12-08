# Check Ministry Order App

A full-stack order management application built with Node.js/Express backend and Next.js frontend, powered by PostgreSQL database.

## Project Overview

This is a monorepo containing:
- **API** (`/api`): Express.js backend with Prisma ORM
- **Web** (`/web`): Next.js frontend with TypeScript and TailwindCSS
- **Database** (`db`): PostgreSQL with Docker

## Prerequisites

Before starting the project, ensure you have the following installed:

- **Docker Desktop** (latest version) - [Download here](https://www.docker.com/products/docker-desktop)
  - Includes Docker Engine and Docker Compose
- **Git** - For cloning and managing the repository
- **Node.js** (v18 or higher) - Optional, only if you want to run services locally without Docker

### Verify Installation

```bash
# Check Docker installation
docker --version
docker compose --version

# Check Node.js (optional)
node --version
npm --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd check-ministry-orderapp
```

### 2. Environment Setup

Create `.env` files for both services:

#### API Environment (`api/.env`)

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@db:5432/test-db
```

#### Web Environment (`web/.env`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### 3. Start the Application with Docker

Run the following command from the project root:

```bash
docker compose up --build
```

This command will:
- Build and start the PostgreSQL database service
- Build and start the Express API service (port 4000)
- Build and start the Next.js web service (port 3000)
- Set up all necessary networks and volumes

**Wait for all services to be ready** (usually 30-60 seconds). You should see logs indicating all services are running.

### 4. Seed Database

To populate the database with initial data:

```bash
npm run prisma:seed
```

### 5. Access the Application

Once all services are running:

- **Web Frontend**: http://localhost:3000
- **API Server**: http://localhost:4000

## Project Structure

```
check-ministry-orderapp/
├── api/                          # Backend (Express.js)
│   ├── src/
│   │   ├── features/
│   │   │   ├── order/           # Order management
│   │   │   └── product/         # Product management
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.ts              # Database seeding
│   │   └── migrations/
│   ├── package.json
│   ├── Dockerfile
│   └── jest.config.js           # Testing configuration
│
├── web/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                 # App routes and layout
│   │   ├── components/          # Reusable components
│   │   ├── features/            # Feature modules
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # Utilities and helpers
│   ├── package.json
│   ├── Dockerfile.dev
│   └── next.config.ts
│
└── docker-compose.yml           # Docker Compose configuration
```

## Database

### PostgreSQL Details

- **Host**: `db` (inside Docker network) or `localhost` (from host machine)
- **Port**: 5432
- **Database**: test-db

### Database Migrations

Migrations are automatically applied when the services start. To manually manage migrations:

```bash
# Inside the api container
npx prisma migrate dev --name <migration-name>
```

## Docker Commands

### View running containers

```bash
docker compose ps
```

### View logs for a specific service

```bash
# View all logs
docker compose logs -f

# View API logs
docker compose logs -f api

# View web logs
docker compose logs -f web

# View database logs
docker compose logs -f db
```

### Stop services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (removes data)
docker compose down -v
```

### Rebuild services

```bash
# Rebuild all images
docker compose build --no-cache

# Rebuild specific service
docker compose build --no-cache api
```

## API Documentation

API endpoints are available in the `api/API.postman_collection.json` file for Postman testing.

### Main Endpoints

- **Orders**
  - `GET /api/orders` - List all orders
  - `POST /api/orders` - Create a new order
  - `GET /api/orders/:id` - Get order details
  - `PUT /api/orders/:id` - Update an order
  - `DELETE /api/orders/:id` - Delete an order

- **Products**
  - `GET /api/products` - List all products
  - `POST /api/products` - Create a new product
  - `GET /api/products/:id` - Get product details
  - `PUT /api/products/:id` - Update a product
  - `DELETE /api/products/:id` - Delete a product

## Technologies Used

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript
- Jest (Testing)

### Frontend
- Next.js
- React
- TypeScript
- TailwindCSS
- React Query
- React Hook Form

### Infrastructure
- Docker
- Docker Compose

#