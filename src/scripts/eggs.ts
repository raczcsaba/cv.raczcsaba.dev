import { botSay } from './bot';

function toast(text: string, ms = 2800) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('on'));
  setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 500); }, ms);
}
const spell = (w: string, ms?: number) => (window as unknown as { __graph?: { spell: (w: string, ms?: number) => void } }).__graph?.spell(w, ms);

export function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
  document.body.appendChild(c);
  const g = c.getContext('2d')!;
  g.scale(devicePixelRatio, devicePixelRatio);
  const colors = ['#c3ff4a', '#52e3ff', '#9b8cff', '#ff6fae', '#ffbe55'];
  const ps = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight * 0.65, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 6,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4, s: 5 + Math.random() * 6, c: colors[(Math.random() * colors.length) | 0],
  }));
  const t0 = performance.now();
  (function f(t: number) {
    g.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of ps) {
      p.vy += 0.42; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore();
    }
    if (t - t0 < 3200) requestAnimationFrame(f); else c.remove();
  })(t0);
}

export function initEggs() {
  // 1. Konami code → synthwave mode + the graph waves hello
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let k = 0;
  // 2. type "hire" anywhere (outside inputs) → graph spells HIRE
  let typed = '';
  addEventListener('keydown', (e) => {
    const inField = (e.target as Element).closest?.('input,textarea,select');
    k = e.key === konami[k] || e.key.toLowerCase() === konami[k] ? k + 1 : e.key === konami[0] ? 1 : 0;
    if (k === konami.length) {
      k = 0;
      const on = document.documentElement.classList.toggle('synth');
      toast(on ? '🕹️ SYNTHWAVE MODE: ON' : 'Back to business mode');
      if (on) { spell('HI!', 7000); window.scrollTo({ top: 0, behavior: 'smooth' }); confetti(); botSay('You know the code. 😎 Respect. Achievement unlocked: <b>Old-school gamer</b>.', 5000, 'wow'); }
    }
    if (inField) return;
    if (e.key === '?') { toast('3 secrets hidden here. One starts with ↑↑. One is a word. One needs sudo.', 4200); return; }
    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-8);
      if (typed.endsWith('hire')) { spell('HIRE', 6500); window.scrollTo({ top: 0, behavior: 'smooth' }); botSay('Excellent idea. The button is at the bottom. 😉', 5000, 'happy'); typed = ''; }
      if (typed.endsWith('read')) { toast('📚 “You have power over your mind, not outside events.” Marcus Aurelius', 4500); typed = ''; }
    }
  });

  // 3. click the logo 5 times fast
  let clicks = 0, ct = 0;
  document.getElementById('logo')?.addEventListener('click', (e) => {
    clicks++;
    clearTimeout(ct);
    ct = window.setTimeout(() => (clicks = 0), 900);
    if (clicks >= 5) { e.preventDefault(); clicks = 0; spell('CR', 5000); botSay('Easy there! That logo has feelings. 🥲', 3500, 'wow'); }
  });

  // 4. a note for the devs who open the console
  console.log(
    '%c CR %c Hey, fellow dev 👋  Built with Astro + Three.js on Cloudflare Pages. Try the Konami code, or ask the bot to "sudo hire csaba". → me@raczcsaba.dev',
    'background:#c3ff4a;color:#000;font-weight:800;padding:4px 6px;border-radius:4px',
    'color:#9aa3b2;padding-left:6px',
  );
}
