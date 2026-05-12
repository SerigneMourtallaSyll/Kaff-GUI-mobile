/**
 * Result<T, E> — typed success/failure outcome.
 *
 * Use at boundaries where throwing would be inappropriate (e.g. expected
 * domain failures like "invalid credentials" that shouldn't be exceptions).
 * For unexpected errors keep throwing; React Query and Error Boundaries
 * handle those.
 */

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },
  err<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },
  isOk<T, E>(r: Result<T, E>): r is { ok: true; value: T } {
    return r.ok;
  },
  isErr<T, E>(r: Result<T, E>): r is { ok: false; error: E } {
    return !r.ok;
  },
  map<T, U, E>(r: Result<T, E>, fn: (v: T) => U): Result<U, E> {
    return r.ok ? Result.ok(fn(r.value)) : r;
  },
  unwrap<T, E>(r: Result<T, E>): T {
    if (r.ok) return r.value;
    throw r.error instanceof Error ? r.error : new Error(String(r.error));
  },
};
