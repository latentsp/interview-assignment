# Argyle Paystub Sync — Take-Home Assignment

## Your Task

Implement a webhook handler that receives mock Argyle paystub events, validates them, and triggers a background job to sync paystub data to our database.

**Time estimate:** 1.5 hours

---

## What You'll Implement

| File | What to Build |
|------|---------------|
| `src/lib/argyle/webhooks.ts` | Zod schema for webhook payload validation |
| `src/app/api/webhooks/argyle/route.ts` | POST handler for incoming webhooks |
| `src/trigger/sync-argyle-paystubs.ts` | Background task to fetch & store paystubs |

Each file contains detailed requirements in comments. Read them first.

---

## Acceptance Criteria

### Webhook Handler (`route.ts`)
- [ ] Verify `X-Argyle-Signature` header (HMAC-SHA256) — return 401 if invalid
- [ ] Validate payload with your Zod schema — return 400 if invalid
- [ ] Log all events to `webhook_events` table (including failures)
- [ ] For paystub events: find income by `external_account_id`, trigger sync task
- [ ] Return 200 on success

### Background Task (`sync-argyle-paystubs.ts`)
- [ ] Fetch paystubs from Argyle API (handle pagination)
- [ ] Upsert paystubs — insert new, update existing (match by `external_id`)
- [ ] Return `{ processed: number }`

### Webhook Schema (`webhooks.ts`)
- [ ] Validate event types: `paystubs.added`, `paystubs.updated`, `paystubs.fully_synced`, `paystubs.partially_synced`
- [ ] Export schema and TypeScript type

---

## Reference Code

Explore before you start:

- `src/lib/argyle/client.ts` — Argyle API client (use this to fetch paystubs)
- `src/lib/argyle/schemas.ts` — Zod schemas for API responses
- `prisma/schema.prisma` — Database schema (`paystubs`, `incomes`, `webhook_events`)
- `src/env.ts` — Environment variables

---

## Setup

### Requirements
- Node.js **v22.19.0+** (`node -v`)
- pnpm v9+
- macOS or Linux (Windows: use WSL2)

### Environment Variables

Create `.env`:

```env
DATABASE_URL="file:./dev.db"
ARGYLE_BASE_URL="http://localhost:8080"
ARGYLE_ID="mock-id"
ARGYLE_SECRET="mock-secret"
ARGYLE_WEBHOOK_SECRET="your-webhook-secret"
TRIGGER_SECRET_KEY="<from trigger.dev dashboard>"
TRIGGER_PROJECT_ID="<from trigger.dev dashboard>"
```

Get Trigger.dev credentials at [trigger.dev](https://trigger.dev) (free account).

### Run the App

```bash
pnpm install
pnpm db:push
pnpm db:generate
pnpm dev                           # Terminal 1: Next.js app
pnpm dlx trigger.dev@latest dev    # Terminal 2: Trigger.dev worker
./scripts/run-mock-server          # Terminal 3: Argyle mock server
```

---

## Testing Your Implementation

### 1. Register your webhook

```bash
curl -X POST http://localhost:8080/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "url": "http://localhost:3000/api/webhooks/argyle",
    "secret": "your-webhook-secret",
    "events": ["paystubs.added", "paystubs.fully_synced", "paystubs.updated"]
  }'
```

> The `secret` must match your `ARGYLE_WEBHOOK_SECRET` env var.

### 2. Trigger a test sync

```bash
curl -X POST http://localhost:8080/simulate/connect-seeded
```

This uses the pre-seeded account ID (`019b41d0-7a84-72db-beab-4f62f8e86ce4`) that matches a database income record.

### 3. Verify

Check Prisma Studio (`pnpm db:studio`) to see if paystubs were synced.

---

## Mock Server API

| Endpoint | Description |
|----------|-------------|
| `POST /webhooks` | Register webhook URL |
| `POST /simulate/connect-seeded` | Trigger webhooks for seeded account |
| `GET /paystubs?account={id}&limit={n}&offset={n}` | List paystubs (paginated) |

The binary implements an Argyle Mock Server that simulates a payroll/paystub API with webhook functionality.
It generates fake paystub data, sends webhook events (like `paystubs.added`, `paystubs.updated`, `paystubs.fully_synced`) to a registered callback URL, and exposes REST endpoints for querying paystubs.
The server includes a comprehensive chaos engineering system that intentionally introduces data, state, timing, order, network or security failures.

---

## Documentation

- [Argyle Paystubs Webhooks](https://docs.argyle.com/api-reference/paystubs-webhooks)
- [Argyle Paystubs API](https://docs.argyle.com/api-reference/paystubs)
- [Trigger.dev Docs](https://trigger.dev/docs)

---

## Questions?

If you're blocked on setup issues (not implementation), reach out. Good luck!
