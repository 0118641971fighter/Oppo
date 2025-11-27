# OPPO Egypt Violations Management System

## Overview

This is a violations management system built for OPPO Egypt, designed to track and manage employee violations. The application features a bilingual interface (Arabic/English) with RTL support, following Material Design principles for a clean, utility-focused admin experience. The system provides user authentication, violation CRUD operations, and a dashboard interface for managing violations efficiently.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (chosen over React Router for simplicity and smaller bundle size)
- TanStack Query (React Query) for server state management and data fetching with automatic caching and background updates

**UI Component System**
- Shadcn/ui components built on Radix UI primitives for accessible, headless components
- Tailwind CSS for utility-first styling with custom theme configuration
- Material Design principles adapted for an Arabic-first interface
- Noto Sans Arabic as the primary font for optimal Arabic text rendering, with Inter for English fallback

**State Management Strategy**
- TanStack Query handles all server state (violations data, user sessions)
- Local component state using React hooks for UI-only concerns
- LocalStorage for simple session persistence (logged-in status)
- No global state management library needed due to straightforward data flow

**Key Design Decisions**
- RTL-first layout with `dir="rtl"` on the HTML root element
- Splash screen → Login → Dashboard flow with conditional rendering based on authentication state
- Toast notifications for user feedback on CRUD operations
- Responsive design with mobile-first breakpoints

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server with middleware-based request handling
- TypeScript throughout for type safety across the full stack
- RESTful API design with standard HTTP methods (GET, POST, PUT, DELETE)

**API Structure**
- `/api/login` - POST endpoint for user authentication (simple username/password validation)
- `/api/violations` - GET (list all), POST (create)
- `/api/violations/:id` - PUT (update), DELETE (delete)
- All responses return JSON with consistent error handling

**Data Validation**
- Zod schemas for runtime type validation
- Drizzle-Zod integration for automatic schema generation from database models
- Request body validation before database operations

**Authentication Approach**
- Simple credential-based authentication (no JWT/sessions for MVP)
- Username/password stored directly (note: production should use hashing)
- Frontend stores login state in localStorage
- No authorization middleware - assumes single trusted admin user

**Rationale**: This is a lightweight internal admin tool, so full session management and password hashing were deferred in favor of rapid development. The architecture allows easy upgrade to proper auth later.

### Data Storage

**Database Technology**
- PostgreSQL as the primary database (configured via Drizzle)
- Neon Database serverless driver for database connections
- Connection pooling handled by `@neondatabase/serverless`

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript schema definitions in `shared/schema.ts`
- Migration support via Drizzle Kit

**Database Schema**
```typescript
users {
  id: varchar (UUID, primary key)
  username: text (unique, not null)
  password: text (not null)
}

violations {
  id: integer (auto-increment, primary key)
  text: text (not null)
}
```

**Development Fallback**
- In-memory storage implementation (`MemStorage` class) for development/testing
- Implements same `IStorage` interface as production database
- Preloaded with sample data for immediate testing

**Rationale**: Drizzle was chosen over Prisma for its lightweight nature and better TypeScript integration. The interface-based storage pattern allows swapping between memory and database implementations without changing application code.

### Project Structure

**Monorepo Organization**
- `/client` - Frontend React application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Route-level page components
  - `/src/lib` - Utilities and configuration
  - `/src/hooks` - Custom React hooks
- `/server` - Backend Express application
  - `index.ts` - Server entry point
  - `routes.ts` - API route definitions
  - `storage.ts` - Database abstraction layer
  - `vite.ts` - Vite dev server integration
- `/shared` - Code shared between client and server
  - `schema.ts` - Database schema and validation types

**Build Process**
- Development: Vite dev server with Express API proxy
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.js`
- Single production server serves both API and static files

**Path Aliases**
- `@/*` resolves to `client/src/*`
- `@shared/*` resolves to `shared/*`
- `@assets/*` resolves to `attached_assets/*`

## External Dependencies

### Database & ORM
- **PostgreSQL** - Primary production database (via DATABASE_URL environment variable)
- **Drizzle ORM** (`drizzle-orm`) - Type-safe database toolkit
- **Drizzle Kit** (`drizzle-kit`) - Schema migrations and introspection
- **Neon Database Serverless** (`@neondatabase/serverless`) - Serverless PostgreSQL driver optimized for edge/serverless environments

### UI Component Libraries
- **Radix UI** - Complete suite of headless, accessible UI primitives (dialogs, dropdowns, tooltips, etc.)
- **Shadcn/ui** - Pre-styled component implementations built on Radix UI
- **Lucide React** - Icon library for consistent iconography

### Form Handling & Validation
- **React Hook Form** - Performant form state management
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe variant generation for components
- **clsx** / **tailwind-merge** - Conditional className utilities

### Data Fetching
- **TanStack Query** (`@tanstack/react-query`) - Async state management with automatic caching, background refetching, and optimistic updates

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server code
- **tsx** - TypeScript execution for development
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Replit-specific development tooling

### Third-Party Services
- **Google Fonts** - Noto Sans Arabic and Inter font families loaded via CDN for optimal Arabic and Latin text rendering

### Session Management (Future Enhancement)
- **connect-pg-simple** - PostgreSQL session store (installed but not currently used; prepared for future session-based authentication)