/* global process, console, document */
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

const baseUrl = process.env.CV_BASE_URL ?? 'http://localhost:4322';
const output = 'public/tristan-visser-cv.pdf';

const browser = await chromium.launch();
const page = await browser.newPage();

const response = await page.goto(`${baseUrl}/cv/print/`, { waitUntil: 'networkidle' });
if (!response?.ok()) {
  throw new Error(`CV print page returned ${response?.status() ?? 'no response'}`);
}

await page.waitForSelector('.cv');
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: 'print', colorScheme: 'light' });

const pdfBuffer = await page.pdf({
  format: 'A4',
  preferCSSPageSize: true,
  printBackground: true,
  tagged: true,
  outline: true,
});

await browser.close();

const pdf = await PDFDocument.load(pdfBuffer);
pdf.setTitle('Tristan Visser — CV');
pdf.setAuthor('Tristan Visser');
pdf.setSubject('Curriculum vitae — final-year BSc Computer Science student');
pdf.setKeywords([
  'Tristan Visser',
  'CV',
  'software engineer',
  'backend developer',
  'full-stack developer',
  'Stellenbosch University',
]);
pdf.setCreator('tristanvisser.co.za');
pdf.setProducer('Playwright / Chromium');
pdf.setLanguage('en-ZA');
pdf.setCreationDate(new Date());
pdf.setModificationDate(new Date());

const bytes = await pdf.save();
const pageCount = pdf.getPageCount();

await writeFile(output, bytes);

if (pageCount > 1) {
  console.warn(`CV is ${pageCount} pages; the target is one page.`);
}

try {
  const text = execFileSync('pdftotext', ['-layout', output, '-'], { encoding: 'utf8' });
  const upper = text.toUpperCase();
  for (const heading of ['Summary', 'Education', 'Experience', 'Projects', 'Skills']) {
    if (!upper.includes(heading.toUpperCase())) {
      throw new Error(`CV text is missing the "${heading}" heading.`);
    }
  }
  if (/E\s+X\s+P\s+E\s+R\s+I\s+E\s+N\s+C\s+E/i.test(text)) {
    throw new Error('CV heading tracking is breaking text extraction.');
  }
} catch (error) {
  if (error instanceof Error && error.message.includes('CV ')) throw error;
  console.warn('Skipped PDF text check (pdftotext is not available).');
}

console.log(`Wrote ${output} (${pageCount} page${pageCount === 1 ? '' : 's'})`);
