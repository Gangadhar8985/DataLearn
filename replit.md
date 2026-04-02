# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **data-learning-hub** (`artifacts/data-learning-hub`) — Static React + Vite website covering Power BI, SQL, and Python. Includes syntax guides, code examples, best practices, and dark mode. Served at `/` (root).
  - Pages: Home, Power BI (DAX, Power Query, Data Modeling, Visualizations), SQL (SELECT, JOINs, Aggregations, CTEs, Window Functions, DDL), Python (Basics, pandas, NumPy, Data Cleaning, Visualization, File Handling)
  - No backend — fully static frontend

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
