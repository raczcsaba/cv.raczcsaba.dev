// Renders /cv/ and /og/ from the built site with headless Chrome:
//   public/csaba-racz-cv.pdf, public/og.png, public/apple-touch-icon.png, public/icon-512.png
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync('dist/cv/index.html')) { console.error('run `npm run build` first'); process.exit(1); }
const srv = spawn('npx', ['astro', 'preview', '--port', '4329'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const base = 'http://localhost:4329';
const chrome = (args) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=4000', ...args], { stdio: 'ignore' });
try {
  chrome(['--no-pdf-header-footer', `--print-to-pdf=public/csaba-racz-cv.pdf`, `${base}/cv/`]);
  chrome(['--window-size=1200,630', '--screenshot=public/og.png', `${base}/og/`]);
  chrome(['--window-size=512,512', '--screenshot=public/icon-512.png', `${base}/favicon.svg`]);
  execFileSync('sips', ['-z', '180', '180', 'public/icon-512.png', '--out', 'public/apple-touch-icon.png'], { stdio: 'ignore' });
  console.log('ok: pdf, og.png, icons');
} finally { srv.kill(); }
