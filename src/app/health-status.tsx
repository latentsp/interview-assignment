"use client";

import { trpc } from "@/trpc/client";

export function HealthStatus() {
  // useSuspenseQuery will suspend until data is available
  // Since we prefetched on the server, this will be instant
  const [health] = trpc.health.useSuspenseQuery();
  const [hello] = trpc.hello.useSuspenseQuery({ text: "Interview Candidate" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600 dark:text-zinc-400">API Status</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${
            health.status === "ok"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              health.status === "ok" ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {health.status === "ok" ? "Healthy" : "Error"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-zinc-600 dark:text-zinc-400">tRPC</span>
        <span className="text-zinc-900 dark:text-zinc-100">
          {hello.greeting}
        </span>
      </div>
    </div>
  );
}
