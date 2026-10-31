// After "vite build": AYRA becomes the site root and the Project 49 app moves to /project-49/.
import { mkdirSync, renameSync, existsSync } from 'node:fs';
const d = 'dist';
mkdirSync(`${d}/project-49`, { recursive: true });
renameSync(`${d}/index.html`, `${d}/project-49/index.html`);
renameSync(`${d}/ayra.html`, `${d}/index.html`);
if (!existsSync(`${d}/index.html`) || !existsSync(`${d}/project-49/index.html`)) { console.error('swap-ayra failed'); process.exit(1); }
console.log('swap-ayra: AYRA at /, Project 49 at /project-49/');
