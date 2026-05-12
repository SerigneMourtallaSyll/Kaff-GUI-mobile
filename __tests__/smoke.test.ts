/**
 * Smoke test — verifies the Jest pipeline + core modules import without
 * exceptions. Add real tests alongside features.
 */
import { Result } from '@/core';
import { loginSchema } from '@/features/auth';

describe('core smoke', () => {
  it('loads core barrel and basic schemas', () => {
    const ok = Result.ok(42);
    expect(Result.isOk(ok)).toBe(true);

    const parsed = loginSchema.safeParse({
      email: 'baay.pitaq@example.com',
      password: 'whatever',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid email at the schema level', () => {
    const parsed = loginSchema.safeParse({ email: 'not-an-email', password: 'x' });
    expect(parsed.success).toBe(false);
  });
});
