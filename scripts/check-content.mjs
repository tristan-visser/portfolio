/* global process, console */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const directory = 'src/content/projects';
const files = readdirSync(directory).filter((file) => /\.(md|mdx)$/.test(file));

const placeholders = files.filter((file) => {
  const source = readFileSync(join(directory, file), 'utf8');
  return /^placeholder:\s*true\s*$/m.test(source);
});

if (placeholders.length > 0 && process.env.ALLOW_PLACEHOLDER_CONTENT !== 'true') {
  console.error('');
  console.error('Refusing to build: placeholder projects are still present.');
  console.error('');
  for (const file of placeholders) console.error(`  - ${join(directory, file)}`);
  console.error('');
  console.error(
    'Replace them with real case studies, or run `pnpm build:preview` for a preview build.',
  );
  console.error('');
  process.exit(1);
}

const withoutLinks = files.filter((file) => {
  const source = readFileSync(join(directory, file), 'utf8');
  return !/^liveUrl:\s*\S+/m.test(source) && !/^repoUrl:\s*\S+/m.test(source);
});

if (withoutLinks.length > 0) {
  console.warn('');
  console.warn('Warning: these projects have no liveUrl or repoUrl yet:');
  for (const file of withoutLinks) console.warn(`  - ${join(directory, file)}`);
  console.warn('Add links before launch so reviewers can try the work.');
  console.warn('');
}

console.log(
  placeholders.length === 0
    ? 'Content check passed: no placeholder projects.'
    : `Content check passed with ${placeholders.length} placeholder project(s) explicitly allowed.`,
);
