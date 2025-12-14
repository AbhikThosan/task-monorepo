# Complete Monorepo Setup Guide
## Turborepo + pnpm + tRPC + React + TypeScript

**Project:** Task Monorepo  
**Date:** December 2024  
**Tech Stack:** Node.js, tRPC, React, React Router, Tailwind CSS, shadcn/ui, pnpm, Turborepo

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Architecture](#project-architecture)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Understanding Key Concepts](#understanding-key-concepts)
6. [Type Safety Setup](#type-safety-setup)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)
9. [File Structure Reference](#file-structure-reference)

---

## Overview

This guide documents the complete setup of a type-safe monorepo using:
- **pnpm** for package management
- **Turborepo** for build orchestration
- **tRPC** for end-to-end type safety between frontend and backend
- **React + TypeScript** for the frontend
- **Express + tRPC** for the backend
- **Tailwind CSS** for styling

### Key Features

✅ Full type safety between API and Web packages  
✅ Automatic type regeneration on backend changes  
✅ Workspace package linking  
✅ Parallel builds with caching  
✅ Hot module replacement for development  

---

## Prerequisites

- Node.js (v18 or higher)
- pnpm installed globally: `npm install -g pnpm`
- Basic knowledge of TypeScript, React, and Node.js

---

## Project Architecture

### Package Structure

```
task-monorepo/
├── packages/
│   ├── ui/          # Shared UI components (future use)
│   ├── api/          # Backend API (tRPC server)
│   └── web/          # Frontend React app
├── package.json      # Root workspace config
├── pnpm-workspace.yaml
├── turbo.json
└── pnpm-lock.yaml
```

### Package Responsibilities

- **UI Package**: Shared React components (prepared for shadcn/ui)
- **API Package**: tRPC server with Express, defines API procedures
- **Web Package**: React frontend that consumes API via tRPC client

---

## Step-by-Step Setup

### Step 1: Initialize Root Package

**Command:**
```bash
pnpm init
```

**What to do:**
1. Create `package.json` at root
2. Set `"private": true`
3. Add scripts:
   ```json
   {
     "scripts": {
       "dev": "turbo run dev",
       "build": "turbo run build",
       "lint": "turbo run lint"
     },
     "private": true
   }
   ```

**What's happening:**
- Creates the workspace root
- Scripts use Turborepo to orchestrate tasks across packages

---

### Step 2: Create pnpm Workspace Configuration

**File:** `pnpm-workspace.yaml`

**Content:**
```yaml
packages:
  - 'packages/*'
```

**What's happening:**
- Tells pnpm which directories contain packages
- Enables workspace features (linking, hoisting)

---

### Step 3: Install Turborepo

**Command:**
```bash
pnpm add -D turbo -w
```

**What's happening:**
- Installs Turborepo as dev dependency at root
- `-w` flag ensures it's installed at workspace root

---

### Step 4: Configure Turborepo

**File:** `turbo.json`

**Content:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Key Points:**
- `"tasks"` (not `"pipeline"`) for Turborepo v2+
- `"dependsOn": ["^build"]` means "wait for dependencies to build first"
- `"outputs"` defines what to cache
- `"persistent": true` for dev servers that run continuously

---

### Step 5: Create Package Structure

**Create directories:**
```bash
mkdir -p packages/api
mkdir -p packages/web
mkdir -p packages/ui
```

---

### Step 6: Set Up UI Package

#### 6.1 Initialize UI Package

**Command:**
```bash
cd packages/ui
pnpm init
```

**Update `package.json`:**
```json
{
  "name": "@tast-monorepo/ui",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

#### 6.2 Install Dependencies

```bash
pnpm add -D typescript @types/node
```

#### 6.3 Create TypeScript Config

**File:** `packages/ui/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 6.4 Create Source Structure

```bash
mkdir -p packages/ui/src
```

**File:** `packages/ui/src/index.ts`
```typescript
export {};
```

---

### Step 7: Set Up API Package

#### 7.1 Initialize API Package

**Command:**
```bash
cd packages/api
pnpm init
```

**Update `package.json`:**
```json
{
  "name": "@task-monorepo/api",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "pnpm build && concurrently -n \"TSC,SERVER\" -c \"blue,green\" \"tsc --watch\" \"nodemon --watch dist --delay 1 dist/index.js\"",
    "start": "node dist/index.js"
  }
}
```

#### 7.2 Install Dependencies

```bash
pnpm add @trpc/server express
pnpm add -D @types/express @types/node typescript concurrently nodemon
pnpm add cors
pnpm add -D @types/cors
```

#### 7.3 Create TypeScript Config

**File:** `packages/api/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Differences from UI:**
- `"module": "commonjs"` (Node.js standard)
- `"moduleResolution": "node"` (Node.js module resolution)

#### 7.4 Create tRPC Router

**File:** `packages/api/src/trpc/router.ts`

```typescript
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  greeting: publicProcedure
    .query(() => {
      return {
        message: 'Hello from tRPC!',
        timestamp: new Date().toISOString(),
      };
    }),
  
  // Add more procedures here
});

// Export the router type - CRITICAL for type safety!
export type AppRouter = typeof appRouter;
```

**Why this matters:**
- `AppRouter` type is exported for frontend
- Frontend will import this type for full type safety

#### 7.5 Create Express Server

**File:** `packages/api/src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

// Add tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

**Key Points:**
- CORS enabled for `localhost:3000` (Vite dev server)
- tRPC endpoint at `/trpc`
- Health check for testing

#### 7.6 Create Entry Point

**File:** `packages/api/src/index.ts`

```typescript
// Export router and type for frontend
export { appRouter, type AppRouter } from './trpc/router';

// Start the server
import './server';
```

---

### Step 8: Set Up Web Package

#### 8.1 Initialize Web Package

**Command:**
```bash
cd packages/web
pnpm init
```

**Update `package.json`:**
```json
{
  "name": "@task-monorepo/web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 8.2 Install Dependencies

```bash
pnpm add react react-dom react-router-dom
pnpm add @trpc/client @trpc/react-query @tanstack/react-query
pnpm add @task-monorepo/api --workspace
pnpm add -D @types/react @types/react-dom @types/node typescript
pnpm add -D vite @vitejs/plugin-react
```

#### 8.3 Create TypeScript Config

**File:** `packages/web/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@task-monorepo/api": ["../api/dist"],
      "@task-monorepo/api/*": ["../api/dist/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Critical Addition:**
- `"paths"` mapping allows TypeScript to resolve workspace package types
- Points to compiled `dist` folder where types are exported

#### 8.4 Create Vite Config

**File:** `packages/web/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

#### 8.5 Create HTML Template

**File:** `packages/web/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Monorepo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### 8.6 Create tRPC Client

**File:** `packages/web/src/lib/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@task-monorepo/api';

// Create tRPC React hooks with the AppRouter type
export const trpc = createTRPCReact<AppRouter>();

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});
```

**Key Points:**
- `createTRPCReact<AppRouter>` - Type parameter ensures type safety
- `AppRouter` type imported from API package
- Client connects to API server at port 3001

#### 8.7 Create React Entry Point

**File:** `packages/web/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './lib/trpc';
import App from './App';
import './index.css';

// Create React Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
```

#### 8.8 Create App Component

**File:** `packages/web/src/App.tsx`

```typescript
import { trpc } from './lib/trpc';

function App() {
  // Fully type-safe tRPC query!
  const { data, isLoading } = trpc.greeting.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data?.message}</h1>
      <p>Timestamp: {data?.timestamp}</p>
    </div>
  );
}

export default App;
```

---

## Understanding Key Concepts

### Workspaces in Monorepo

**What is a workspace?**
- A way to manage multiple related packages in one repository
- Packages can reference each other using `workspace:*` protocol
- Shared dependencies are hoisted to root

**How it works:**
1. `pnpm-workspace.yaml` defines which folders are packages
2. `workspace:*` in `package.json` creates symlinks
3. Dependencies are hoisted when possible
4. Single `pnpm-lock.yaml` for all packages

**Example:**
```json
// packages/web/package.json
{
  "dependencies": {
    "@task-monorepo/api": "workspace:*"
  }
}
```

This creates a symlink: `packages/web/node_modules/@task-monorepo/api` → `packages/api`

### Turborepo Tasks

**Task Dependencies:**
- `"dependsOn": ["^build"]` - Wait for dependencies to build first
- `^` means "workspace dependencies"
- Ensures correct build order

**Caching:**
- `"outputs"` defines what to cache
- Subsequent builds are faster
- Cache can be shared across team

### Type Safety Flow

```
1. API Package defines procedures
   └── Exports AppRouter type
   
2. Web Package imports AppRouter type
   └── Creates typed tRPC client
   
3. TypeScript enforces types
   └── Errors if types don't match
   └── Autocomplete for all procedures
```

---

## Type Safety Setup

### How End-to-End Type Safety Works

1. **Backend defines types:**
   ```typescript
   // packages/api/src/trpc/router.ts
   export const appRouter = router({
     greeting: publicProcedure.query(() => {
       return { message: string, timestamp: string };
     }),
   });
   export type AppRouter = typeof appRouter;
   ```

2. **Frontend imports type:**
   ```typescript
   // packages/web/src/lib/trpc.ts
   import type { AppRouter } from '@task-monorepo/api';
   export const trpc = createTRPCReact<AppRouter>();
   ```

3. **TypeScript enforces:**
   - If you change backend return type → Frontend shows error
   - If you remove a procedure → Frontend shows error
   - Autocomplete shows all available procedures

### Testing Type Safety

1. Change backend procedure:
   ```typescript
   greeting: publicProcedure.query(() => {
     return {
       message: 'Hello!',
       userId: 123, // Changed from timestamp
     };
   }),
   ```

2. Rebuild API: `pnpm build` (or use watch mode)

3. Frontend immediately shows TypeScript error:
   ```
   Property 'timestamp' does not exist on type '{ message: string; userId: number; }'
   ```

---

## Development Workflow

### Starting Development

**Option 1: Run individually**

Terminal 1 (API):
```bash
pnpm --filter @task-monorepo/api dev
```
- Compiles TypeScript in watch mode
- Regenerates types automatically
- Starts Express server on port 3001
- Auto-restarts on code changes

Terminal 2 (Web):
```bash
pnpm --filter @task-monorepo/web dev
```
- Starts Vite dev server
- Opens React app at http://localhost:3000
- Hot module replacement enabled

**Option 2: Run all together**

From root:
```bash
pnpm dev
```
- Turborepo runs `dev` in all packages
- Both API and Web start in parallel

### Building for Production

```bash
pnpm build
```

**What happens:**
1. Turborepo discovers all packages
2. Builds dependencies first (UI, API)
3. Then builds dependents (Web)
4. Caches outputs for faster subsequent builds

### Type Regeneration

**During development:**
- API runs `tsc --watch` automatically
- Types regenerate on file save
- Frontend picks up new types (may need 1-2 seconds)

**If types don't update:**
1. Restart TypeScript server in editor
2. Or save the file again to trigger refresh

---

## Troubleshooting

### Issue: TypeScript can't find `@task-monorepo/api`

**Solution:**
Add path mapping in `packages/web/tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@task-monorepo/api": ["../api/dist"],
      "@task-monorepo/api/*": ["../api/dist/*"]
    }
  }
}
```

### Issue: CORS errors

**Solution:**
Ensure CORS is configured in `packages/api/src/server.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Issue: Types don't update immediately

**Solution:**
1. Ensure API is running in watch mode: `pnpm --filter @task-monorepo/api dev`
2. Restart TypeScript server in editor
3. Wait 1-2 seconds after saving

### Issue: `ERR_CONNECTION_REFUSED`

**Solution:**
- API server not running
- Start it: `pnpm --filter @task-monorepo/api dev`
- Verify it's listening on port 3001

### Issue: Package not linked

**Solution:**
```bash
pnpm install
```
This creates workspace symlinks.

---

## File Structure Reference

### Complete File Tree

```
task-monorepo/
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml          # Workspace definition
├── turbo.json                   # Turborepo config
├── pnpm-lock.yaml               # Lockfile
│
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── dist/               # Generated
│   │
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts        # Exports router & type
│   │   │   ├── server.ts       # Express + CORS + tRPC
│   │   │   └── trpc/
│   │   │       └── router.ts   # tRPC router definition
│   │   └── dist/               # Generated
│   │
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx        # React entry point
│           ├── App.tsx         # Main component
│           ├── index.css       # Tailwind imports
│           └── lib/
│               └── trpc.ts     # tRPC client setup
```

### Key Files Summary

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Defines workspace packages |
| `turbo.json` | Build pipeline configuration |
| `packages/api/src/trpc/router.ts` | Defines API procedures & exports `AppRouter` type |
| `packages/api/src/server.ts` | Express server with CORS & tRPC middleware |
| `packages/web/src/lib/trpc.ts` | Creates type-safe tRPC client |
| `packages/web/tsconfig.json` | TypeScript config with path mappings |

---

## Best Practices

### 1. Always Export Types from API

```typescript
// packages/api/src/trpc/router.ts
export type AppRouter = typeof appRouter; // CRITICAL!
```

### 2. Use Workspace Protocol

```json
{
  "dependencies": {
    "@task-monorepo/api": "workspace:*"
  }
}
```

### 3. Run Watch Mode During Development

```bash
pnpm --filter @task-monorepo/api dev
```

### 4. Keep TypeScript Configs Consistent

- UI: ESNext modules, bundler resolution
- API: CommonJS modules, node resolution
- Web: ESNext modules, bundler resolution + path mappings

### 5. Test Type Safety Regularly

- Change backend types
- Verify frontend shows errors
- Ensures type safety is working

---

## Commands Reference

### Root Level

```bash
# Install all dependencies
pnpm install

# Run dev in all packages
pnpm dev

# Build all packages
pnpm build

# Run command in specific package
pnpm --filter @task-monorepo/api <command>
pnpm --filter @task-monorepo/web <command>
```

### Package Level

```bash
# API Package
cd packages/api
pnpm dev        # Watch mode + server
pnpm build      # Build once
pnpm start      # Run server only

# Web Package
cd packages/web
pnpm dev        # Vite dev server
pnpm build      # Production build
pnpm preview    # Preview production build
```

---

## Next Steps

### Adding More Procedures

1. Add to `packages/api/src/trpc/router.ts`:
   ```typescript
   export const appRouter = router({
     greeting: publicProcedure.query(() => { ... }),
     getUser: publicProcedure
       .input(z.object({ id: z.string() }))
       .query(({ input }) => { ... }),
   });
   ```

2. Types automatically available in frontend:
   ```typescript
   const { data } = trpc.getUser.useQuery({ id: "123" });
   ```

### Adding React Router

1. Install: `pnpm add react-router-dom`
2. Set up routes in `App.tsx`
3. Use tRPC hooks in route components

### Adding Tailwind CSS

1. Install in Web package: `pnpm add -D tailwindcss postcss autoprefixer`
2. Initialize: `pnpm exec tailwindcss init -p`
3. Configure to scan UI package components
4. Import CSS in `main.tsx`

### Adding shadcn/ui

1. Install in Web package
2. Configure to use UI package for components
3. Share components via UI package

---

## Summary

This monorepo setup provides:

✅ **Type Safety**: End-to-end type safety between API and Web  
✅ **Fast Development**: Watch mode, hot reload, parallel builds  
✅ **Code Sharing**: Workspace packages can import each other  
✅ **Scalability**: Easy to add new packages  
✅ **Best Practices**: Industry-standard tooling and patterns  

The setup is production-ready and follows modern monorepo best practices.

---

## Appendix: Complete Configuration Files

### Root package.json
```json
{
  "name": "task-monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.25.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.6.3"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

**End of Guide**

For questions or issues, refer to:
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

