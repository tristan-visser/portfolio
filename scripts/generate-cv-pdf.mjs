/* global process, console */
import { chromium } from '@playwright/test';

const baseUrl = process.env.CV_BASE_URL ?? 'http://localhost:4322';
const output = 'public/tristan-visser-cv.pdf';

const browser = await chromium.launch();
const page = await browser.newPage();

const response = await page.goto(`${baseUrl}/cv/`, { waitUntil: 'load' });
if (!response?.ok()) {
  throw new Error(`CV page returned ${response?.status() ?? 'no response'}`);
}

await page.waitForSelector('.cv');
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: output, format: 'A4', printBackground: true });
await browser.close();

console.log(`Wrote ${output}`);
