/**
 * Structured logger.
 *
 * - Silent in production unless explicitly enabled.
 * - Never logs sensitive payloads — caller is responsible for redaction.
 * - Designed to be swapped with a remote sink (Sentry, Datadog, ...) at boot
 *   time without touching call sites.
 */
import { env } from '@/core/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogPayload = Record<string, unknown>;

type LogSink = (level: LogLevel, message: string, payload?: LogPayload) => void;

const consoleSink: LogSink = (level, message, payload) => {
  if (!env.enableLogs && env.isProduction) return;
  const tag = `[${level.toUpperCase()}]`;
  // eslint-disable-next-line no-console
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  if (payload) {
    fn(tag, message, payload);
  } else {
    fn(tag, message);
  }
};

let activeSink: LogSink = consoleSink;

export const logger = {
  setSink(sink: LogSink): void {
    activeSink = sink;
  },
  debug(message: string, payload?: LogPayload): void {
    activeSink('debug', message, payload);
  },
  info(message: string, payload?: LogPayload): void {
    activeSink('info', message, payload);
  },
  warn(message: string, payload?: LogPayload): void {
    activeSink('warn', message, payload);
  },
  error(message: string, payload?: LogPayload): void {
    activeSink('error', message, payload);
  },
};

export type { LogLevel, LogPayload, LogSink };
