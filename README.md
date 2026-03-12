# 3 Tier Ordering App

A full-stack order management application built with Node.js/Express backend and Next.js frontend, powered by PostgreSQL database.

## Project Overview

This is a monorepo containing:
- **API** (`/api`): Express.js backend with Prisma ORM
- **Web** (`/web`): Next.js frontend with TypeScript and TailwindCSS
- **Database** (`db`): PostgreSQL with Docker

## Live Application

The live application is available at a own Azure VM through Github action: 

- **Web Application**: https://dmh.cleaoo.com
- **API Server**: https://api.dmh.cleaoo.com

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
cd orderapp
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

Once all services are running locally:

- **Web Frontend**: http://localhost:3000
- **API Server**: http://localhost:4000

## Project Structure

```
orderapp/
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



## Assumptions & Tradeoffs

### Database Transactions
- **Assumption**: All order operations (create, update, delete) use database transactions to ensure data consistency and prevent partial updates.
- **Benefit**: Guarantees ACID compliance and data integrity across related records.

### Hard Delete Implementation
- **Tradeoff**: Currently using hard delete for order operations instead of soft delete (status-based hiding).
- **Future Consideration**: In production, soft delete is recommended for audit trails, compliance, and data recovery. Orders should ideally change status (e.g., cancelled, archived) rather than being permanently removed.

### Deployment Strategy
- **Tradeoff**: Chose to deploy on a personal VM with custom domain instead of serverless platforms (Vercel, Netlify) or managed hosting.
- **Rationale**: The application includes a persistent PostgreSQL database and requires continuous uptime, making managed hosting less cost-effective. Hosting on a personal VM with custom domain allows full control over infrastructure, subdomains, and SSL certificates.
- **Architecture**: Services are deployed via Docker Compose and exposed through Nginx reverse proxy on subdomains:
  - **Web Frontend**: https://dmh.cleaoo.com (Next.js application)
  - **API Server**: https://api.dmh.cleaoo.com (Express.js backend)
- **Benefits**: Full control over deployment, custom domain ownership, ability to scale horizontally, and direct access to database and server logs.



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

## Production Deployment

### Prerequisites for Production

Before running the production Docker Compose setup, create the required Docker network:

```bash
# Create the Docker network for production
docker network create cleaoo-net
```

Then run the production services:

```bash
docker compose -f docker-compose.prod.yml up --build
```

This will use the `cleaoo-net` network defined in the production configuration.

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

The following endpoints are available for the Order App API:

### Main Endpoints

- **Orders**
  - `GET /api/orders` - List all orders
  - `POST /api/orders` - Create a new order
  - `GET /api/orders/:id` - Get order details
  - `PUT /api/orders/:id` - Update an order
  - `DELETE /api/orders/:id` - Delete an order

- **Products**
  - `GET /api/products` - List all products

## Technologies Used

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript
- Zod Runtime Validator
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
