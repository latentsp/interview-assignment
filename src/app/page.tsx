import { Suspense } from "react";
import { trpc, HydrateClient } from "@/trpc/server";
import { HealthStatus } from "./health-status";

export default async function Home() {
  // Prefetch data on the server - this starts fetching immediately
  void trpc.health.prefetch();
  void trpc.hello.prefetch({ text: "Interview Candidate" });

  return (
    <HydrateClient>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
        <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-8 px-8 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Interview Task
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              See README.md for instructions
            </p>
          </div>

          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              System Status
            </h2>
            <Suspense
              fallback={
                <div className="animate-pulse text-zinc-400">Loading...</div>
              }
            >
              <HealthStatus />
            </Suspense>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}
