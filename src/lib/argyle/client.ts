import { createFetch, createSchema } from "@better-fetch/fetch";
import { env } from "@/env";
import {
  ArgylePaystubsQuerySchema,
  ArgylePaginatedResponseSchema,
  ArgylePaystubSchema,
} from "./schemas";

/**
 * Argyle API schema - defines all routes with their query params and response types.
 * All schemas imported from ./schemas.ts for consistency.
 */
const argyleSchema = createSchema(
  {
    "/paystubs": {
      query: ArgylePaystubsQuerySchema,
      output: ArgylePaginatedResponseSchema(ArgylePaystubSchema),
    },
  },
  { strict: true },
);

/**
 * Type-safe Argyle API client using better-fetch.
 *
 * Usage:
 *   const { data, error } = await argyle("/paystubs", {
 *     query: { user: "uuid-here" }
 *   });
 *
 * The client automatically:
 *   - Validates query params and responses using Zod schemas
 *   - Adds Basic auth headers
 *   - Sets content type and timeout
 */
export const argyle = createFetch({
  baseURL: env.ARGYLE_BASE_URL.replace(/\/$/, ""), // Remove trailing slash if present
  timeout: 30_000,
  schema: argyleSchema,
  headers: {
    Authorization: `Basic ${Buffer.from(`${env.ARGYLE_ID}:${env.ARGYLE_SECRET}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
});
