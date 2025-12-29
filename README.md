# Interview Task: Argyle Paystub Sync

## Context

We integrate with [Argyle](https://argyle.com) to sync payroll data. When a user connects their payroll account, Argyle sends webhooks notifying us of new or updated paystubs. Your task is to implement the webhook handler and background sync task.

## The Task

Implement a complete data sync pipeline:

```
Webhook arrives → Validate & verify → Find income record → Trigger background task → Fetch from API → Save to database
```

## Files to Implement

| File | Purpose |
|------|---------|
| `src/lib/argyle/webhooks.ts` | Zod schemas for webhook payload validation |
| `src/app/api/webhooks/argyle/route.ts` | Webhook HTTP handler |
| `src/trigger/sync-argyle-paystubs.ts` | Background task to fetch and store paystubs |

Each file contains requirements. Read them.

## Documentation

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
- [ ] Triggers sync for: `paystubs.fully_synced`, `paystubs.added`, `paystubs.updated`
- [ ] Finds income by `external_account_id`

### Sync Task
- [ ] Fetches paystubs from Argyle API
- [ ] Handles pagination
- [ ] Inserts new paystubs
- [ ] Updates existing paystubs
- [ ] No duplicate records
- [ ] Returns `{ inserted, updated, total }`

### Webhook Schemas
- [ ] Validates all three event types
- [ ] Exports schema and TypeScript type

## Setup

```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev

# In another terminal:
pnpm trigger:dev
```

## Database

The database is pre-seeded with a test user and income record. Use Prisma Studio to explore:

```bash
pnpm db:studio
```

## Time

~1.5 hours
