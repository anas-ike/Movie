import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const cssFiles = ['app.css', 'components.css', 'player.css', 'responsive.css'];
const requiredSelectors = {
  'app.css': [':root', 'body', '.navbar', '.hero', '.btn-primary'],
  'components.css': ['.media-card', '.detail-hero', '.auth-form', '.episode-card'],
  'player.css': ['.player-wrapper', '.server-selector', '.server-btn'],
  'responsive.css': ['@media']
};
const conflictMarkers = /^(<<<<<<<|=======|>>>>>>>)/m;

for (const file of cssFiles) {
  const source = await fs.readFile(path.join(root, 'public', 'css', file), 'utf8');
  if (conflictMarkers.test(source)) throw new Error(`Unresolved Git conflict marker found in public/css/${file}`);
  if (/\\:root|\\:/.test(source)) throw new Error(`Escaped CSS property syntax found in public/css/${file}; deploy the clean CSS file, not a patch artifact`);
  for (const selector of requiredSelectors[file]) {
    if (!source.includes(selector)) throw new Error(`public/css/${file} is missing required selector ${selector}`);
  }
}

for (const asset of ['public/js/app.js', 'public/images/logo.svg', 'public/sw.js']) {
  await fs.access(path.join(root, asset));
}
console.log('static_asset_verification_passed');
