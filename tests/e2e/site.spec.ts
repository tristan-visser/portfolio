import { expect, test } from '@playwright/test';

test('home page has the expected content', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Tristan Visser/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tristan');
  await expect(page.getByRole('main').getByText(/Open to on-site, hybrid or remote/)).toBeVisible();
  await expect(page.getByRole('link', { name: /selected work/i }).first()).toBeVisible();
});

test('work page lists projects and links to a case study', async ({ page }) => {
  await page.goto('/work/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Work.');
  await expect(
    page.getByRole('heading', { name: 'Electrum Dependency Analysis Framework' }),
  ).toBeVisible();

  await page.getByRole('link', { name: /Electrum Dependency Analysis Framework/ }).click();
  await expect(page).toHaveURL(/\/work\/electrum-dependency-engine\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Electrum Dependency Analysis Framework',
  );
  await expect(page.getByRole('link', { name: /back to work/i })).toBeVisible();
});

test('about page explains who Tristan is', async ({ page }) => {
  await page.goto('/about/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('computer science');
  await expect(page.getByText('BSc Computer Science')).toBeVisible();
});

test('contact form validates and reports success', async ({ page }) => {
  await page.route('**/api/contact/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto('/contact/');

  await page.getByLabel('Name').fill('Test Person');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('This is a test message for the contact form.');
  await page.getByRole('button', { name: /send message/i }).click();

  await expect(page.getByRole('status')).toContainText(/message has been sent/i);
});

test('unknown routes return the custom 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');

  expect(response?.status()).toBe(404);
  await expect(page.getByText('Error 404 · Not found')).toBeVisible();
});

test('CV PDF is available', async ({ request }) => {
  const response = await request.get('/tristan-visser-cv.pdf');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('privacy page is available from the footer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).click();

  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy.');
});
