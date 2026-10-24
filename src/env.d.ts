/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly SITE_NOINDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace Cloudflare {
  interface Env {
    /** Set with `wrangler secret put TURNSTILE_SECRET_KEY`. */
    TURNSTILE_SECRET_KEY: string;
  }
}
