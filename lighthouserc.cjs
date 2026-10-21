/* global process, module */
const isCI = Boolean(process.env.CI);

/** @type {import('@lhci/cli').Configuration} */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4322/',
        'http://localhost:4322/work/',
        'http://localhost:4322/about/',
        'http://localhost:4322/contact/',
      ],
      numberOfRuns: isCI ? 3 : 1,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
      },
      ...(isCI
        ? {
            startServerCommand: 'ASTRO_PREVIEW_BACKGROUND=0 pnpm preview --port 4322',
            startServerReadyPattern: 'Preview server running',
            startServerReadyTimeout: 120_000,
          }
        : {}),
    },
    assert: {
      assertions: {
        // Shared CI runners are noisy; the local target is 95+, but a hard 95
        // gate here fails on runner variance rather than real regressions.
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
