# Task Monorepo

A type-safe monorepo built with Turborepo, pnpm, tRPC, React, TypeScript, and PostgreSQL.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10.25.0 or higher) - Install with: `npm install -g pnpm@10.25.0`
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-monorepo
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all packages in the monorepo.

### 3. Set Up PostgreSQL Database

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### On Windows:
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

### 4. Create Database and User

Access PostgreSQL:
```bash
sudo -u postgres psql
```

Then run these SQL commands:
```sql
-- Create database
CREATE DATABASE task_monorepo_db;

-- Create user (optional - you can use postgres user)
CREATE USER task_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE task_monorepo_db TO task_user;

-- Grant schema privileges
\c task_monorepo_db
GRANT ALL ON SCHEMA public TO task_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO task_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO task_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO task_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO task_user;

-- Grant database creation permission (for Prisma migrations)
ALTER USER task_user CREATEDB;

-- Exit
\q
```

### 5. Configure Environment Variables

Create a `.env` file in `packages/api/`:

```bash
cd packages/api
touch .env
```

Add the following content to `packages/api/.env`:

```env
DATABASE_URL="postgresql://task_user:your_secure_password_here@localhost:5432/task_monorepo_db?schema=public"
```

**Note:** Replace `your_secure_password_here` with the password you set for `task_user`, or use the `postgres` user if you didn't create a custom user:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_monorepo_db?schema=public"
```

### 6. Run Database Migrations

```bash
cd packages/api
npx prisma migrate deploy
```

Or if you want to apply pending migrations in development:

```bash
npx prisma migrate dev
```

### 7. Generate Prisma Client

```bash
cd packages/api
npx prisma generate
```

### 8. Seed the Database (Optional)

To populate the database with demo menu items:

```bash
cd packages/api
pnpm seed
```

### 9. Start Development Servers

From the **root directory**, run:

```bash
pnpm dev
```

This will start:
- **API Server** on `http://localhost:3001`
- **Web App** on `http://localhost:3000`

## 📁 Project Structure

```
task-monorepo/
├── packages/
│   ├── api/          # Backend API (tRPC + Express + Prisma)
│   ├── ui/           # Shared UI components (shadcn/ui)
│   └── web/           # Frontend React app
├── package.json       # Root workspace config
├── pnpm-workspace.yaml
├── turbo.json
└── .gitignore
```

## 🛠️ Available Scripts

### Root Level

- `pnpm dev` - Start all packages in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages

### API Package (`packages/api`)

- `pnpm dev` - Start API server with hot reload
- `pnpm build` - Build TypeScript
- `pnpm start` - Start production server
- `pnpm seed` - Seed database with demo data

### Web Package (`packages/web`)

- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## 🔧 Troubleshooting

### Issue: "Permission denied" when creating database

**Solution:** Grant CREATEDB permission:
```sql
ALTER USER task_user CREATEDB;
```

### Issue: "Module not found" errors

**Solution:** Reinstall dependencies:
```bash
pnpm install
```

### Issue: Prisma Client not found

**Solution:** Generate Prisma Client:
```bash
cd packages/api
npx prisma generate
```

### Issue: Database connection error

**Solution:** 
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check `.env` file exists and has correct `DATABASE_URL`
3. Verify database and user exist

### Issue: Port already in use

**Solution:** 
- Change API port in `packages/api/src/server.ts` (default: 3001)
- Change Web port in `packages/web/vite.config.ts` (default: 3000)

## 📚 Tech Stack

- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **Backend:** Node.js, Express, tRPC
- **Database:** PostgreSQL with Prisma ORM
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui

## 🔐 Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string (in `packages/api/.env`)

### Optional

- `PORT` - API server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## 📝 Development Workflow

1. Make changes to code
2. Files auto-reload (hot module replacement)
3. TypeScript compiles in watch mode
4. API server restarts automatically on changes

## 🧪 Testing the API

Once servers are running:

- **Frontend:** http://localhost:3000
- **API Health Check:** http://localhost:3001/health
- **tRPC Endpoint:** http://localhost:3001/trpc

## 📖 Additional Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## 📄 License

ISC

