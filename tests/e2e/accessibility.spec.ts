import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
  { path: '/work/', name: 'work' },
  { path: '/work/electrum-dependency-engine/', name: 'case study' },
  { path: '/about/', name: 'about' },
  { path: '/contact/', name: 'contact' },
  { path: '/cv/', name: 'cv' },
  { path: '/privacy/', name: 'privacy' },
];

for (const { path, name } of pages) {
  test(`${name} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
