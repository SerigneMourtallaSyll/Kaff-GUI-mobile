/**
 * Application error taxonomy.
 *
 * Every error that crosses a feature boundary or surfaces to the UI MUST be
 * an `AppError` (or a subclass). This guarantees:
 *   - Stable error codes for the UI to map to user-facing messages.
 *   - Safe serialization (no PII / secrets leaked in stack traces).
 *   - Easy mapping to Sentry / monitoring breadcrumbs.
 */

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppErrorOptions {
  code: AppErrorCode;
  message: string;
  status?: number;
  cause?: unknown;
  /** Field-level validation errors (key = field name). */
  fields?: Record<string, string[]>;
  /** Whether the user can retry the same action (UI hint). */
  retryable?: boolean;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;
  readonly fields?: Record<string, string[]>;
  readonly retryable: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = 'AppError';
    this.code = options.code;
    this.status = options.status;
    this.fields = options.fields;
    this.retryable = options.retryable ?? false;

    if (options.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }

  static isAppError(value: unknown): value is AppError {
    return value instanceof AppError;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      status: this.status,
      fields: this.fields,
      retryable: this.retryable,
    };
  }
}
