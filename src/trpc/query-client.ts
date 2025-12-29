import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

/**
 * Creates a new QueryClient with proper defaults for RSC/SSR.
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // Include pending queries in dehydration for Suspense
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}
