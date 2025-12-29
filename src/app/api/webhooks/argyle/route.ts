/**
 * Argyle Webhook Handler
 *
 * Requirements:
 * - Handle POST requests from Argyle
 * - Verify webhook signature
 * - Validate payload structure
 * - Log all webhook events to the webhook_events table
 * - For paystub events (paystubs.added, paystubs.updated, paystubs.fully_synced):
 *   - Find the income record by matching payload.data.account to incomes.external_account_id
 *   - Trigger the sync task to fetch and store paystubs
 * - Return appropriate HTTP status codes (401 for auth failures, 400 for validation errors, 200 for success)
 *
 * Docs: https://docs.argyle.com/api-reference/paystubs-webhooks
 */
