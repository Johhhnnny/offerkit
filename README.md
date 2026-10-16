# OfferKit AI

OfferKit AI helps small businesses create marketing content quickly: promotional captions, WhatsApp adverts, content calendars, flyer copy, and short-form video ideas.

## What's in the repository

- `src/`: React + TypeScript web application
- `worker/index.ts`: Cloudflare Workers AI API
- `wrangler.jsonc`: Worker configuration
- `docs/`: deployment and pre-launch security notes
- `.github/workflows/ci.yml`: build check on pushes and pull requests

## Run the web app locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

To make a production build:

```bash
npm run build
```

The frontend uses a sample draft when the API is not configured, so the interface can be previewed without an AI endpoint. To use live generation, deploy the Cloudflare Worker and set `VITE_API_URL` to its URL before building the frontend.

## Deploy

See [docs/deploy.md](docs/deploy.md) for Cloudflare Pages and Workers AI setup.

## Important before accepting payments

This is a prototype, not a production-ready paid service. It does not yet have user accounts, billing, server-side per-user usage limits, or a complete abuse-prevention system. Review [docs/security-checklist.md](docs/security-checklist.md) and implement these controls before launch.
