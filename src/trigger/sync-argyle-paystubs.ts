/**
 * Trigger.dev Task: Sync Argyle Paystubs
 *
 * Requirements:
 * - Fetch all paystubs from Argyle API for the given user/account
 * - Handle API pagination (fetch all pages)
 * - Insert new paystubs, update existing ones (use external_id to identify)
 * - No duplicate records
 * - Return metrics: { processed: number }
 *
 * The task receives: { userId, incomeId, argyleUserId, argyleAccountId }
 *
 * Docs: https://docs.argyle.com/api-reference/paystubs
 */
