import { describe, expect, it } from 'vitest';
import { parseContactPayload } from '@/lib/contact';

const valid = {
  name: 'Tristan Visser',
  email: 'tristan@example.com',
  message: 'I would like to talk about a graduate software role.',
  website: '',
  token: 'test-token',
};

describe('parseContactPayload', () => {
  it('accepts a valid payload and trims values', () => {
    const result = parseContactPayload({
      ...valid,
      name: '  Tristan Visser  ',
      email: '  tristan@example.com ',
    });

    expect(result).toEqual({
      ok: true,
      data: {
        ...valid,
        name: 'Tristan Visser',
        email: 'tristan@example.com',
      },
    });
  });

  it('rejects a missing or oversized name', () => {
    expect(parseContactPayload({ ...valid, name: '' }).ok).toBe(false);
    expect(parseContactPayload({ ...valid, name: 'a'.repeat(81) }).ok).toBe(false);
  });

  it('rejects names with control characters', () => {
    expect(parseContactPayload({ ...valid, name: 'Tristan\u0000Visser' }).ok).toBe(false);
  });

  it('rejects invalid email addresses', () => {
    for (const email of ['', 'not-an-email', 'a@b', 'a b@example.com']) {
      expect(parseContactPayload({ ...valid, email }).ok).toBe(false);
    }
  });

  it('rejects messages outside the length limits', () => {
    expect(parseContactPayload({ ...valid, message: 'short' }).ok).toBe(false);
    expect(parseContactPayload({ ...valid, message: 'a'.repeat(5001) }).ok).toBe(false);
  });

  it('accepts an empty honeypot and a filled one', () => {
    expect(parseContactPayload({ ...valid, website: '' }).ok).toBe(true);
    const result = parseContactPayload({ ...valid, website: 'https://spam.example' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.website).toBe('https://spam.example');
  });

  it('rejects a non-object payload', () => {
    expect(parseContactPayload(null).ok).toBe(false);
    expect(parseContactPayload('hello').ok).toBe(false);
  });
});
