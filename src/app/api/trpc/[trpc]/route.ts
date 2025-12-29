import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

/**
 * tRPC HTTP handler for Next.js App Router.
 * This handles all tRPC requests at /api/trpc/*
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
