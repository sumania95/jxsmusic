import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXT_CRON_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_RESEND_API: z.string(),
    NEXT_RESEND_WEBHOOK_SECRET:z.string(),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_ID: z.string(),
    S3_SECRET_KEY: z.string(),
    MEDIA_CUTTER_URL: z.string().url(),
    NEXT_SPOTIFY_SECRET_API_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    PAYPAL_CLIENT_ID: z.string(),
    PAYPAL_CLIENT_SECRET: z.string(),
    PAYPAL_WEBHOOK_ID: z.string(),
    PAYPAL_ENVIRONMENT: z.enum(["sandbox", "live"]).default("sandbox"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_SPOTIFY_CLIENT_API_KEY: z.string(),
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_CRON_SECRET: process.env.NEXT_CRON_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RESEND_API: process.env.NEXT_RESEND_API,
    NEXT_RESEND_WEBHOOK_SECRET: process.env.NEXT_RESEND_WEBHOOK_SECRET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_ACCESS_ID: process.env.S3_ACCESS_ID,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    MEDIA_CUTTER_URL: process.env.MEDIA_CUTTER_URL,
    NEXT_PUBLIC_SPOTIFY_CLIENT_API_KEY:
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_API_KEY,
    NEXT_SPOTIFY_SECRET_API_KEY: process.env.NEXT_SPOTIFY_SECRET_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID,
    PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
