/**
 * Type-safe environment configuration.
 *
 * All EXPO_PUBLIC_* variables are inlined at build time by Metro. We validate
 * them through Zod at module load so that boot-time failures are loud and
 * explicit (banking-grade: never silently fall back to broken values).
 */
import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8000/api/v1'),
  EXPO_PUBLIC_API_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  EXPO_PUBLIC_ENABLE_LOGS: z
    .union([z.literal('true'), z.literal('false')])
    .default('true')
    .transform((v) => v === 'true'),
  EXPO_PUBLIC_ENABLE_DEVTOOLS: z
    .union([z.literal('true'), z.literal('false')])
    .default('true')
    .transform((v) => v === 'true'),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional().default(''),
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

type RawEnv = Record<keyof z.infer<typeof envSchema>, string | undefined>;

const rawEnv: RawEnv = {
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_API_TIMEOUT_MS: process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
  EXPO_PUBLIC_ENABLE_LOGS: process.env.EXPO_PUBLIC_ENABLE_LOGS,
  EXPO_PUBLIC_ENABLE_DEVTOOLS: process.env.EXPO_PUBLIC_ENABLE_DEVTOOLS,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  // Fail loud at boot — never run with an invalid configuration.
  console.error('[env] Invalid environment configuration:', parsed.error.flatten());
  throw new Error('Invalid environment configuration. Check .env.');
}

export const env = {
  apiBaseUrl: parsed.data.EXPO_PUBLIC_API_BASE_URL,
  apiTimeoutMs: parsed.data.EXPO_PUBLIC_API_TIMEOUT_MS,
  enableLogs: parsed.data.EXPO_PUBLIC_ENABLE_LOGS,
  enableDevtools: parsed.data.EXPO_PUBLIC_ENABLE_DEVTOOLS,
  sentryDsn: parsed.data.EXPO_PUBLIC_SENTRY_DSN,
  appEnv: parsed.data.EXPO_PUBLIC_APP_ENV,
  isProduction: parsed.data.EXPO_PUBLIC_APP_ENV === 'production',
  isDevelopment: parsed.data.EXPO_PUBLIC_APP_ENV === 'development',
} as const;

export type Env = typeof env;
