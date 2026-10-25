import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// If executed inside apps/web
const isInsideWeb = fs.existsSync(path.resolve(process.cwd(), 'vite.config.js'));

if (isInsideWeb) {
  console.log('[Build] Detected execution inside apps/web. Running vite build...');
  execSync('npx vite build', {
    stdio: 'inherit',
    shell: true,
  });
  console.log('[Build] Build complete inside apps/web/dist!');
} else {
  // Executed from repository root
  console.log('[Build] Detected execution from root. Building @fdr/web...');
  const rootDir = process.cwd();
  const webDistDir = path.resolve(rootDir, 'apps/web/dist');
  const rootDistDir = path.resolve(rootDir, 'dist');

  execSync('npm run build --workspace=apps/web', {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  if (fs.existsSync(webDistDir)) {
    console.log(`[Build] Synchronizing ${webDistDir} -> ${rootDistDir}...`);
    if (!fs.existsSync(rootDistDir)) {
      fs.mkdirSync(rootDistDir, { recursive: true });
    }
    fs.cpSync(webDistDir, rootDistDir, { recursive: true, force: true });
    console.log('[Build] Successfully synchronized dist output to root /dist!');
  }
}
