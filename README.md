# tristanvisser.co.za

Personal portfolio for **Tristan Visser**, a final-year BSc Computer Science student at Stellenbosch University. The site is built to be fast, accessible and easy to extend with real project case studies.

**Status:** working preview. Real case studies from coursework and industry work are in place; links, screenshots and final copy are still being added.

## Stack

- **Astro 7** with the official Cloudflare adapter
- **TypeScript** in strict mode
- **Tailwind CSS 4** with design tokens in `src/styles/global.css`
- **Cloudflare Workers** with static assets
- **Cloudflare Email Service + Turnstile** for the contact form
- **GitHub Actions** for CI, accessibility/Lighthouse checks and deployment

The design direction and component rules are in [`docs/design.md`](docs/design.md). Architecture decisions are in [`docs/decisions.md`](docs/decisions.md).

## Local development

```sh
mise install
pnpm install
pnpm dev
```

The dev server uses Cloudflare's `workerd` runtime through the Astro adapter. The site is available at the URL printed by Astro.

### Contact form locally

Copy the example environment file and fill in the Turnstile secret:

```sh
cp .dev.vars.example .dev.vars
```

The public Turnstile site key belongs in `.env.local` as `PUBLIC_TURNSTILE_SITE_KEY`. The production secret is stored in Cloudflare with `wrangler secret put TURNSTILE_SECRET_KEY`; it is never committed.

If the site key is missing, the contact page shows an email fallback instead of a broken form.

## Content workflow

1. Fill in `docs/content-intake.md` (local only, gitignored). It contains private details, so it is not committed.
2. Update the project files in `src/content/projects/` with links, screenshots, dates and any details that are missing.
3. Remove `placeholder: true` from any future placeholder project.
4. Update `src/config.ts` with the final links, email and availability.
5. Add screenshots to `src/assets/` and reference them from the project frontmatter.

Project frontmatter is validated by Zod in `src/content.config.ts`. Required fields include `title`, `summary`, `role`, `timeline`, `year`, `stack`, and at least one of `liveUrl` or `repoUrl` when the project is ready.

### Build guard

```sh
pnpm build          # fails if any project still has placeholder: true
pnpm build:preview  # explicit preview build; allows placeholders
```

This is intentional. It is too easy to forget that demo content is still on a portfolio. The guard also warns about projects without a live or repository link.

## Commands

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Start the Astro dev server                      |
| `pnpm build`         | Production build; blocks placeholder content    |
| `pnpm build:preview` | Preview build; allows placeholder content       |
| `pnpm build:staging` | Production build with `noindex` for the preview |
| `pnpm preview`       | Preview the built Worker locally                |
| `pnpm check`         | Astro and TypeScript checks                     |
| `pnpm lint`          | ESLint                                          |
| `pnpm format`        | Prettier write                                  |
| `pnpm format:check`  | Prettier check                                  |
| `pnpm test`          | Vitest unit tests                               |
| `pnpm test:e2e`      | Playwright desktop and mobile tests             |
| `pnpm lighthouse`    | Lighthouse CI against the local preview         |
| `pnpm cv:pdf`        | Regenerate the public CV PDF from `/cv/`        |
| `pnpm cf:types`      | Regenerate `worker-configuration.d.ts`          |
| `pnpm deploy`        | Deploy the Worker with Wrangler                 |

Rebuild and restart `pnpm preview` after changing the Worker or the headers. The CV PDF is generated from the running preview, so run `pnpm preview` before `pnpm cv:pdf`.

## Cloudflare setup

Already configured for the preview:

- Worker `tristanvisser` on `https://tristanvisser.tristanvisser.workers.dev`
- Turnstile widget for `tristanvisser.co.za`, `www`, `localhost` and the workers.dev preview
- Email Routing for `hello@`, `contact@` and `website@tristanvisser.co.za`, forwarded to the verified Gmail destination
- Email Sending enabled for `tristanvisser.co.za` with SPF, DKIM and DMARC

At launch:

1. Connect `tristanvisser.co.za` as the Worker custom domain.
2. Add a `www` redirect to the apex domain.
3. Remove the workers.dev hostname from the Turnstile widget and `ALLOWED_ORIGIN`.
4. Remove `http://localhost:4322` from `ALLOWED_ORIGIN`.
5. Enable HSTS at the Cloudflare zone level (it is intentionally not in `_headers`, so local HTTP previews do not break).
6. GitHub Actions already deploys on `main`. Optionally connect Workers Builds later and remove the GitHub deploy job.
7. Add a `noindex` or Cloudflare Access rule for preview deployments.
8. Enable DNSSEC and the free WAF managed ruleset.
9. Add Cloudflare Web Analytics if wanted, then update the CSP and privacy notice.

## Security notes

- `.env.local` and `.dev.vars` are gitignored. No production secrets are committed.
- The contact endpoint is same-origin only, validates the payload, uses a honeypot, verifies Turnstile server-side and never logs message content.
- Security headers live in `public/_headers`: CSP, frame protection, nosniff, referrer policy, permissions policy and COOP.
- `worker-configuration.d.ts` is generated by `wrangler types` and committed so CI can type-check without secrets.
- The API token in `.env.local` is a broad setup token. It should be rotated after setup; CI does not use it. Deployment uses a separate scoped token stored in GitHub Actions secrets, limited to Workers Scripts and Workers Routes.

## What still needs to happen

- Add a live URL or repository URL for each of the five case studies.
- Add screenshots or diagrams for the remaining projects.
- Confirm the project years and any outcomes that are not already on the CV.
- The public CV PDF is generated from `/cv/` with `pnpm cv:pdf`; the original FlowCV PDF stays local because it contains a phone number.
- Add a professional photo if wanted; the site works without one.
- Connect the custom domain, set up Workers Builds, and remove the preview hostname from Turnstile/`ALLOWED_ORIGIN`.
- Run the final cross-browser and real-device pass.

## Quality bar

- Lighthouse mobile: 95+ across performance, accessibility, best practices and SEO. The CI performance gate is 85 on shared runners to avoid flaky failures; accessibility, best practices and SEO stay at 95.
- WCAG 2.2 AA: semantic landmarks, keyboard complete, visible focus, reduced motion, 200% zoom, 320px reflow.
- Core Web Vitals targets: LCP under 1.5s, INP under 100ms, CLS under 0.05.
- Playwright + axe run on every page in desktop and mobile Chromium.
- Unit tests cover contact payload validation.
- No fake projects, metrics, testimonials or screenshots.

## Repository layout

```
src/
  components/       Astro components
  content/          Project case studies
  layouts/          Base layout
  lib/              SEO, content and contact helpers
  pages/            Routes, including /api/contact
  styles/           Tailwind theme and prose styles
public/             Static assets and security headers
scripts/            Content guard
tests/              Unit and end-to-end tests
docs/               Design and architecture notes
```
