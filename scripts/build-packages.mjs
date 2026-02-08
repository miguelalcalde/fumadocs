import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Packages that the docs app needs, in dependency order
const packages = [
  'packages/core',
  'packages/mdx',
  'packages/openapi',
  'packages/doc-gen',
  'packages/twoslash',
  'packages/typescript',
  'packages/story',
];

for (const pkg of packages) {
  const pkgDir = resolve(root, pkg);
  const distDir = resolve(pkgDir, 'dist');

  if (existsSync(distDir)) {
    console.log(`[build] ${pkg}: dist/ already exists, skipping`);
    continue;
  }

  if (!existsSync(resolve(pkgDir, 'package.json'))) {
    console.log(`[build] ${pkg}: package.json not found, skipping`);
    continue;
  }

  console.log(`[build] Building ${pkg}...`);
  try {
    execSync('pnpm run build', {
      cwd: pkgDir,
      stdio: 'inherit',
      timeout: 120_000,
    });
    console.log(`[build] ${pkg}: built successfully`);
  } catch (err) {
    console.warn(`[build] ${pkg}: build failed, continuing...`, err.message);
  }
}

console.log('[build] Package build complete');
