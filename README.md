# Picgen

An image-generation studio built with Next.js 14, Clerk, MongoDB/Prisma, Hugging Face Inference Providers, and Stripe.

## Included

- Responsive landing page, prompt handoff, active navigation, and mobile menu.
- Z-Image Turbo by default; FLUX.1 Schnell as an alternative. Both are Apache-2.0 models.
- Aspect ratios, style presets, optional seeds, curated inspiration, and per-account local prompt drafts.
- Private persistent image library, favorites, downloads, and prompt reuse.
- 50 welcome credits, 5 credits per image. Atomic reservations prevent negative balances and simultaneous jobs.
- Idempotent generation requests; provider failures are refunded. Jobs interrupted for more than five minutes are recovered on the next account or generation request.
- One-time Stripe credit packs with signed, idempotent webhook delivery. Client-provided payment amounts and account IDs are never trusted.

## Configuration

Keep secrets in ignored `.env.local`. Never use a `NEXT_PUBLIC_` prefix for secret keys.

Required:
- `DATABASE_URL`: MongoDB replica-set URI. Transactions require a replica set; MongoDB Atlas supports this.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `HF_ACCESS_TOKEN`: Hugging Face token with Inference Providers permission.

For account webhooks:
- `WEBHOOK_SECRET`: Clerk signing secret. Point the `user.created` webhook to `/api/webhooks/clerk`.
- Accounts also initialize lazily on authenticated studio access, so signup does not depend on webhook delivery.

For credit purchases:
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`: canonical site origin, such as `http://localhost:3000` in development.
- Point Stripe events `checkout.session.completed` and `checkout.session.async_payment_succeeded` to `/api/webhooks/stripe`.
- Credit packs are defined server-side in `lib/plans.ts`. They are one-time payments, not subscriptions.
- Use Stripe test mode until checkout and webhook forwarding have been verified.

Open model weights are free to use under their licenses. Hosted inference consumes provider credits; free Hugging Face credits are limited. Image requests use Hugging Face's fal-ai routing and provider-specific image dimensions. The token is never sent to the browser.

## Run

```sh
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Before pushing a schema to an existing database, review its indexes against the Prisma schema. Existing subscription payment-intent uniqueness is retained.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run test:integration
```

Integration tests use isolated temporary account records in the configured MongoDB database, mock authentication and image inference, exercise real transactions and signed Stripe events, and remove their records afterward. They do not create real payments or consume inference credits.

`node scripts/provider-smoke.cjs` performs one real image generation and consumes provider credits. Output goes to ignored `.tmp/`.

## Operational notes

Images are stored as base64 in MongoDB with an 8 MB image limit. For a high-volume deployment, move image bytes to private object storage while retaining account ownership checks. Keep the 120-second route timeout supported by your hosting plan. Background jobs are the next step for longer-running workloads.

The production hosting environment needs its own secrets; local environment changes are not deployed automatically. Rotate credentials that have been shared in messages.

Model sources:
- https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
- https://huggingface.co/black-forest-labs/FLUX.1-schnell
- https://huggingface.co/docs/inference-providers/pricing
