import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const webDistDir = path.resolve(rootDir, 'apps/web/dist');
const rootDistDir = path.resolve(rootDir, 'dist');

console.log('[Build] Building @fdr/web via Vite...');
execSync('npm run build --workspace=apps/web', {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

if (fs.existsSync(webDistDir)) {
  console.log(`[Build] Copying build artifacts from ${webDistDir} to ${rootDistDir}...`);
  if (!fs.existsSync(rootDistDir)) {
    fs.mkdirSync(rootDistDir, { recursive: true });
  }
  fs.cpSync(webDistDir, rootDistDir, { recursive: true, force: true });
  console.log('[Build] Successfully synchronized dist output to root /dist!');
} else {
  console.error('[Build Error] apps/web/dist was not found after build!');
  process.exit(1);
}
