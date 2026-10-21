import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { parseContactPayload } from '@/lib/contact';

export const prerender = false;

const MAX_BODY_BYTES = 12_000;

const json = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
): Promise<boolean> {
  if (!token) return false;

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (remoteIp) form.append('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');
  const allowedOrigins = env.ALLOWED_ORIGIN.split(',').map((value) => value.trim());
  if (origin && !allowedOrigins.includes(origin)) {
    return json({ error: 'Origin not allowed.' }, 403);
  }

  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error: 'Unsupported content type.' }, 415);
  }

  const contentLength = Number(request.headers.get('Content-Length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: 'Message is too large.' }, 413);
  }

  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'Message is too large.' }, 413);
    }
    input = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const parsed = parseContactPayload(input);
  if (!parsed.ok) {
    return json({ error: 'Please check the form fields.', fields: parsed.errors }, 422);
  }

  const { name, email, message, website, token } = parsed.data;

  // Honeypot: return a success response so bots do not learn what happened.
  if (website) {
    return json({ ok: true });
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('Contact form: TURNSTILE_SECRET_KEY is not configured');
    return json({ error: 'The form is not configured yet.' }, 503);
  }

  const verified = await verifyTurnstile(
    token,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
  );

  if (!verified) {
    return json({ error: 'Verification failed. Please try again.' }, 400);
  }

  try {
    await env.EMAIL.send({
      to: env.CONTACT_TO,
      from: { email: env.CONTACT_FROM, name: 'Tristan Visser portfolio' },
      replyTo: { email, name },
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return json({ ok: true });
  } catch (error) {
    console.error(
      'Contact form: email send failed',
      error instanceof Error ? error.message : 'unknown error',
    );
    return json({ error: 'The message could not be sent. Please email me directly.' }, 502);
  }
};
