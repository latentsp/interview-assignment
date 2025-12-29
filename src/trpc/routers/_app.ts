import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";

/**
 * Root router for the application.
 * This is where all sub-routers are merged.
 */
export const appRouter = createTRPCRouter({
  // Health check procedure
  health: baseProcedure.query(() => {
    return { status: "ok" };
  }),

  // Example procedure with input validation
  hello: baseProcedure
    .input(
      z.object({
        text: z.string().optional().default("world"),
      })
    )
    .query((opts) => {
      return {
        greeting: `Hello ${opts.input.text}!`,
      };
    }),
});

// Export type definition of API
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
