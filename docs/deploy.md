# Deploying OfferKit AI

## Frontend
1. Create a Cloudflare Pages project connected to this GitHub repository.
2. Build command: `npm run build`.
3. Build output directory: `dist`.
4. Add `VITE_API_URL` pointing to the deployed Worker URL, for example `https://offerkit-ai.<your-subdomain>.workers.dev`.

## AI Worker
1. Install dependencies locally with `npm install`.
2. Log in with `npx wrangler login`.
3. Deploy the Worker using `npm run deploy`.
4. Confirm Workers AI is enabled for your Cloudflare account.
5. Set `ALLOWED_ORIGIN` to the exact deployed Pages URL before launch.

## Before launch
The starter is a prototype. Add authentication, server-side usage limits, billing, and abuse protection before accepting paying customers.