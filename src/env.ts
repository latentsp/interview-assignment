import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables. Will throw if accessed on the client.
   */
  server: {
    DATABASE_URL: z.string(),
    ARGYLE_BASE_URL: z.string().url(),
    ARGYLE_ID: z.string(),
    ARGYLE_SECRET: z.string(),
    ARGYLE_WEBHOOK_SECRET: z.string(),
    TRIGGER_SECRET_KEY: z.string(),
    TRIGGER_PROJECT_ID: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Client-side environment variables (must be prefixed with NEXT_PUBLIC_).
   * Empty for this project as all env vars are server-side only.
   */
  client: {},

  /**
   * Manually destructure process.env for each variable.
   * Required for Next.js edge runtimes and client-side access.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ARGYLE_BASE_URL: process.env.ARGYLE_BASE_URL,
    ARGYLE_ID: process.env.ARGYLE_ID,
    ARGYLE_SECRET: process.env.ARGYLE_SECRET,
    ARGYLE_WEBHOOK_SECRET: process.env.ARGYLE_WEBHOOK_SECRET,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,
    TRIGGER_PROJECT_ID: process.env.TRIGGER_PROJECT_ID,
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * Useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes empty strings treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
