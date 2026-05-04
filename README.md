# Cloudflare Workers + React + shadcn/ui Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jstolosa-spec/panipone-barangay-information-system)

A production-ready full-stack template for building scalable applications on Cloudflare Workers. Features a modern React frontend with shadcn/ui, Tailwind CSS, and a type-safe Durable Objects backend powered by Hono. Perfect for real-time apps, dashboards, and APIs.

## Features

- **React 18 + Vite** for fast development and hot module replacement
- **shadcn/ui** component library with full TypeScript support
- **Cloudflare Durable Objects** for stateful entities (e.g., Users, Chats) with indexing
- **Hono** routing on the Worker backend
- **TanStack Query** for data fetching and caching
- **React Router** for client-side navigation
- **Tailwind CSS** with custom design tokens and animations
- **Dark/Light theme** support with persistence
- **Error boundaries** and client error reporting
- **Type-safe shared types** between frontend and backend
- **Bun** as the package manager for speed
- **Cloudflare Pages/Workers** deployment ready
- Demo chat app with real-time messaging via Durable Objects

## Tech Stack

| Frontend | Backend | Tools |
|----------|---------|-------|
| React 18, Vite, TypeScript | Cloudflare Workers, Hono, Durable Objects | Bun, Tailwind CSS, shadcn/ui, Lucide Icons |
| TanStack Query, React Router | TypeScript, SQLite (Durable Objects) | Wrangler CLI, ESLint, Prettier |

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd <project>
   bun install
   ```

2. **Development**
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (frontend) with Worker proxy.

3. **Build & Preview**
   ```bash
   bun build
   bun preview
   ```

## Installation

This project uses **Bun** for package management and scripting.

```bash
# Install dependencies
bun install

# Generate Cloudflare types (if needed)
bun cf-typegen
```

Ensure you have:
- Bun v1.1+
- Wrangler CLI: `bun add -g wrangler`
- Cloudflare account (free tier sufficient)

## Development

### Frontend
- Edit `src/pages/HomePage.tsx` for your app UI
- Use shadcn/ui components from `@/components/ui/*`
- API calls via `src/lib/api-client.ts`
- Routing in `src/main.tsx`

### Backend
- **DO NOT** modify `worker/index.ts` or `worker/core-utils.ts`
- Add routes in `worker/user-routes.ts`
- Extend entities in `worker/entities.ts` (e.g., `IndexedEntity`)
- Shared types: `shared/types.ts`

### Scripts
```bash
bun dev          # Start dev server (frontend + Worker proxy)
bun lint         # Lint codebase
bun build        # Production build
bun preview      # Local preview
```

### Example API Usage (from demo)

```typescript
// List users
const users = await api<User[]>('/api/users');

// Create chat
const chat = await api<Chat>('/api/chats', {
  method: 'POST',
  body: JSON.stringify({ title: 'My Chat' })
});

// Send message
const msg = await api<ChatMessage>('/api/chats/${chat.id}/messages', {
  method: 'POST',
  body: JSON.stringify({ userId: 'u1', text: 'Hello!' })
});
```

Available endpoints:
- `/api/users` (CRUD)
- `/api/chats` (list/create)
- `/api/chats/:id/messages` (list/send)
- `/api/health` (status)

### Customization Tips
- Replace `src/pages/HomePage.tsx` with your app
- Add sidebar: Wrap in `AppLayout` from `@/components/layout/AppLayout`
- Seed data: Extend `entities.ts` with `static seedData`
- Theme: Toggle via `useTheme()` hook

## Deployment

Deploy to Cloudflare Workers/Pages with one command:

```bash
bun deploy
```

Or manually:
```bash
bun build  # Builds frontend to dist/
wrangler deploy
```

**Configuration**: `wrangler.jsonc` handles Durable Objects and assets.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jstolosa-spec/panipone-barangay-information-system)

**Pro Tip**: Use Cloudflare's Git integration for CI/CD.

## Environment Variables

Set in Wrangler dashboard or `wrangler.toml`:
```
None required for demo
```

## Contributing

1. Fork and clone
2. `bun install`
3. `bun dev`
4. Submit PR

## License

MIT. See [LICENSE](LICENSE) for details.