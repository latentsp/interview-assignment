# Interview Task: Argyle Paystub Sync

## Context

We integrate with mock [Argyle](https://argyle.com) to sync payroll data. When a user connects their payroll account, Argyle sends webhooks notifying us of new or updated paystubs. Your task is to implement the webhook handler and background sync task.

## Prerequisites
* Create a `.env` file and fill it with the correct information as needed in `env.ts`
  * ARGYLE_ID and ARGYLE_SECRET can be mocked
  * Argyle Base URL needs to be set up correctly, as Argyle Client references it, please refer to mock server section to understand what its value should be.
  * ARGYLE_WEBHOOK_SECRET needs to be set up correctly, this README.md explains it's purpose
  * Register (https://trigger.dev) and copy the Project id and API key

## The Task

Implement a complete data sync pipeline:

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│ Webhook arrives │─────▶│ Validate & verify│─────▶│ Find income record│
└─────────────────┘      └──────────────────┘      └─────────┬─────────┘
                                                             │
                                                             ▼
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│ Save to database│◀─────│  Fetch from API  │◀─────│Trigger background │
└─────────────────┘      └──────────────────┘      │       task        │
                                                   └───────────────────┘
```

## Files to Implement

| File | Purpose |
|------|---------|
| `src/lib/argyle/webhooks.ts` | Zod schemas for webhook payload validation |
| `src/app/api/webhooks/argyle/route.ts` | Webhook HTTP handler |
| `src/trigger/sync-argyle-paystubs.ts` | Background task to fetch and store paystubs |

Each file contains requirements. Read them.

## Additional Documentation

- [Argyle Paystubs Webhooks](https://docs.argyle.com/api-reference/paystubs-webhooks) - Webhook events, payloads, signature verification
- [Argyle Paystubs API](https://docs.argyle.com/api-reference/paystubs) - Fetching paystub data

## Existing Code to Reference

Before implementing, explore the codebase:

- `src/lib/argyle/client.ts` - Argyle API client (you'll use this)
- `src/lib/argyle/schemas.ts` - Zod schemas for API responses
- `src/lib/db.ts` - Database client
- `prisma/schema.prisma` - Database schema (check the `paystubs` and `incomes` tables)
- `src/env.ts` - Environment variables

## Acceptance Criteria

### Webhook Handler
- [ ] Returns 401 for missing/invalid signature
- [ ] Returns 400 for invalid payload
- [ ] Returns 200 for valid webhooks
- [ ] Logs all events to `webhook_events` table (including failures)
- [ ] Updates `processed_at` or `failed_at` with error details
- [ ] Triggers sync for: `paystubs.fully_synced`, `paystubs.partially_synced`, `paystubs.added`, `paystubs.updated`
- [ ] Finds income by `external_account_id`

### Sync Task
- [ ] Fetches paystubs from Argyle API
- [ ] Handles pagination
- [ ] Inserts new paystubs
- [ ] Updates existing paystubs
- [ ] No duplicate records
- [ ] Returns `{ processed }`

### Webhook Schemas
- [ ] Validates all event types
- [ ] Exports schema and TypeScript type

## Setup

```bash
pnpm install

pnpm db:push
pnpm db:generate
pnpm dev
```

Open two additional terminal screens and do:
1. `pnpm dlx trigger.dev@latest dev`
2. `./scripts/run-mock-server`

## Argyle Mock Server

This project includes a local mock server that simulates the Argyle API. It sends webhooks to your application and exposes a paystubs API for fetching data.

### Starting the Mock Server

Run the mock server using the wrapper script which automatically detects your platform:

```bash
./scripts/run-mock-server
```

The server runs on `http://localhost:8080`.

### Registering Your Webhook

Before the mock server can send events to your app, register your webhook endpoint:

```bash
curl -X POST http://localhost:8080/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Subscription",
    "url": "http://localhost:3000/api/webhooks/argyle",
    "secret": "your-webhook-secret",
    "events": ["paystubs.added", "paystubs.fully_synced", "paystubs.updated"]
  }'
```

> **Important:** The `secret` you provide here must match your `ARGYLE_WEBHOOK_SECRET` environment variable. All webhooks are signed with `X-Argyle-Signature` (HMAC-SHA256).

### Simulating a User Connection

To simulate a user connecting their payroll account using the **seeded test data**:

```bash
curl -X POST http://localhost:8080/simulate/connect-seeded
```

This uses the pre-seeded account ID (`019b41d0-7a84-72db-beab-4f62f8e86ce4`) that matches the income record in the database, allowing you to test the full sync flow.

To simulate with a random (new) account:

```bash
curl -X POST http://localhost:8080/simulate/connect
```

### What Happens During Simulation

When you trigger `/simulate/connect-seeded`:

1. **24 months of paystub history** is generated
2. `paystubs.partially_synced` webhook is sent
3. `paystubs.fully_synced` webhook is sent
4. Your handler should trigger the sync task to fetch and store the data

### Mock API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/webhooks` | Register your webhook URL |
| `POST` | `/simulate/connect` | Simulate random account connection |
| `POST` | `/simulate/connect-seeded` | Simulate seeded account connection |
| `GET` | `/paystubs?account={id}&limit={n}&offset={n}` | List paystubs (paginated) |
| `GET` | `/paystubs/{id}` | Get a specific paystub |

### Background Behavior

The binary implements an Argyle Mock Server that simulates a payroll/paystub API with webhook functionality.
It generates fake paystub data, sends webhook events (like `paystubs.added`, `paystubs.updated`, `paystubs.fully_synced`) to a registered callback URL, and exposes REST endpoints for querying paystubs.
The server includes a comprehensive chaos engineering system that intentionally introduces data, state, timing, order, network or security failures.

Once registered, the mock server automatically:
- Sends random `paystubs.added` and `paystubs.updated` webhooks every 3-8 seconds
- ~20% of events use the seeded account ID
- ~5% of events include a failure scenario
- Persists all data to `db.json` (survives restarts)

## Database

The database is pre-seeded with a test user and income record. Use Prisma Studio to explore:

```bash
pnpm db:studio
```

The seeded income record has:
- `external_account_id`: `019b41d0-7a84-72db-beab-4f62f8e86ce4`

This matches the account ID used by `/simulate/connect-seeded`.
