import { initTRPC } from "@trpc/server";
import { cache } from "react";

/**
 * Creates the context for tRPC procedures.
 * Called for each request. Wrapped in React cache() for RSC deduplication.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = cache(async () => {
  return {
    // Add context properties here as needed (db, session, etc.)
  };
});

// Avoid exporting the entire t-object since it's not very descriptive.
// For instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

/**
 * Export reusable router and procedure helpers.
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
