export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website: string;
  token: string;
};

export type ContactField = keyof ContactPayload;
export type ContactErrors = Partial<Record<ContactField, string>>;

type ParseResult = { ok: true; data: ContactPayload } | { ok: false; errors: ContactErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function hasControlCharacters(value: string): boolean {
  // Deliberately match C0 control characters (excluding tab, newline and carriage return).
  // eslint-disable-next-line no-control-regex
  return /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
}

export function parseContactPayload(input: unknown): ParseResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, errors: { name: 'Invalid request.' } };
  }

  const record = input as Record<string, unknown>;
  const name = asString(record.name);
  const email = asString(record.email);
  const message = asString(record.message);
  const website = asString(record.website);
  const token = asString(record.token);

  const errors: ContactErrors = {};

  if (name.length < 1 || name.length > 80) {
    errors.name = 'Please enter your name (up to 80 characters).';
  } else if (hasControlCharacters(name)) {
    errors.name = 'Please remove invalid characters from your name.';
  }

  if (email.length < 3 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  } else if (hasControlCharacters(email)) {
    errors.email = 'Please remove invalid characters from your email.';
  }

  if (message.length < 10 || message.length > 5000) {
    errors.message = 'Please write a message between 10 and 5,000 characters.';
  } else if (message.includes('\u0000')) {
    errors.message = 'Please remove invalid characters from your message.';
  }

  if (website.length > 200) {
    errors.website = 'Invalid request.';
  }

  if (token.length > 4096) {
    errors.token = 'Invalid verification token.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, email, message, website, token } };
}
