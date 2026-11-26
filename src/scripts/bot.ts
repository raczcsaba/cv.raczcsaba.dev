// "Bitsy": the floating AI companion. Reacts to cursor, scroll and sections locally (free),
// and talks to /api/chat (Claude) when opened.

type Msg = { role: 'user' | 'assistant'; content: string };
type Mood = 'happy' | 'wow' | 'shy' | '';

const bot = document.getElementById('bot')!;
const orb = document.getElementById('orb')!;
const face = orb.querySelector<HTMLElement>('.bot__face')!;
const bubble = document.getElementById('bubble')!;
const badge = document.getElementById('orb-badge')!;
const chat = document.getElementById('chat')!;
const log = document.getElementById('chat-log')!;
const form = document.getElementById('chat-form') as HTMLFormElement;
const input = document.getElementById('chat-input') as HTMLTextAreaElement;
const chips = document.getElementById('chat-chips')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let open = false;
let busy = false;
let bubbleTimer = 0;
let currentSection = 'top';
let lastHoverProject = '';
const history: Msg[] = JSON.parse(sessionStorage.getItem('bitsy') || '[]');
let api: { openProject: (id: string) => void } = { openProject: () => {} };

/* ---------------- mood + bubble ---------------- */
function mood(m: Mood, ms = 1800) {
  bot.classList.remove('happy', 'wow', 'shy');
  if (m) bot.classList.add(m);
  if (m && ms) setTimeout(() => bot.classList.remove(m), ms);
}
export function botSay(html: string, ms = 5000, m: Mood = '', cta?: { label: string; ask: string }) {
  if (open) return;
  clearTimeout(bubbleTimer);
  bubble.innerHTML = html + (cta ? `<br><button type="button" data-ask="${cta.ask.replace(/"/g, '&quot;')}">${cta.label}</button>` : '');
  bubble.classList.add('on');
  bot.classList.add('talk');
  setTimeout(() => bot.classList.remove('talk'), Math.min(1600, html.length * 28));
  if (m) mood(m, ms);
  bubbleTimer = window.setTimeout(() => bubble.classList.remove('on'), ms);
}

/* ---------------- eyes follow cursor ---------------- */
let px = innerWidth / 2, py = innerHeight / 2, shyLatch = false;
addEventListener('pointermove', (e) => {
  px = e.clientX; py = e.clientY;
  const r = orb.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, d / 300);
  orb.style.setProperty('--lx', `${(dx / d) * 6 * k}px`);
  orb.style.setProperty('--ly', `${(dy / d) * 5 * k}px`);
  orb.style.setProperty('--tilt', `${(dx / d) * 6 * k}deg`);
  const near = d < 110 && !open;
  if (near && !shyLatch) { shyLatch = true; bot.classList.add('shy'); }
  if (!near && shyLatch) { shyLatch = false; bot.classList.remove('shy'); }
}, { passive: true });
void face;

/* blink */
(function blink() {
  setTimeout(() => {
    bot.classList.add('blink');
    setTimeout(() => bot.classList.remove('blink'), 120);
    if (Math.random() < 0.25) setTimeout(() => { bot.classList.add('blink'); setTimeout(() => bot.classList.remove('blink'), 110); }, 260);
    blink();
  }, 2200 + Math.random() * 3800);
})();

/* ---------------- reactions (local, no tokens) ---------------- */
const sectionLines: Record<string, { t: string; cta?: { label: string; ask: string } }> = {
  work: { t: 'These are real, shipped projects. Click any card for the full story.', cta: { label: 'Which one is the hardest?', ask: 'Which of these projects was technically the hardest, and why?' } },
  stack: { t: 'Yes, all of it. He gets bored when a stack is too small. 😄', cta: { label: 'Is he more backend or frontend?', ask: 'Is Csaba more of a backend or a frontend engineer?' } },
  journey: { t: 'From a vocational course in 2022 to leading AI and mobile builds. Not bad, right?' },
  lab: { t: 'Off-hours mode: hi-fi audio, soldering and slow-cooked pörkölt. 🎧🍲', cta: { label: 'Tell me a secret fun fact', ask: 'Tell me a fun fact about Csaba that is not on the site' } },
  contact: { t: 'Have an idea? Tell me in two sentences and I’ll write the message for you. ✍️', cta: { label: 'Help me write it', ask: 'I have a project idea, can you help me shape it and fill in the contact form?' } },
};
const seen = new Set<string>();
const io = new IntersectionObserver((es) => {
  for (const e of es) {
    if (!e.isIntersecting) continue;
    currentSection = e.target.id;
    if (seen.has(e.target.id)) continue;
    seen.add(e.target.id);
    const line = sectionLines[e.target.id];
    if (line) setTimeout(() => currentSection === e.target.id && botSay(line.t, 6500, 'happy', line.cta), 700);
  }
}, { threshold: 0.35 });
['top', 'work', 'stack', 'journey', 'lab', 'contact'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

/* speed-scroll */
let lastY = scrollY, lastT = performance.now(), speedCooldown = 0;
addEventListener('scroll', () => {
  const now = performance.now();
  const v = Math.abs(scrollY - lastY) / Math.max(1, now - lastT);
  lastY = scrollY; lastT = now;
  if (v > 6 && now > speedCooldown) { speedCooldown = now + 20000; botSay('Whoa, speed-reader! 🏎️ I can summarise it all if you want.', 4000, 'wow', { label: 'Give me the 30-second version', ask: 'Give me the 30-second summary of Csaba as an engineer.' }); }
  resetIdle();
}, { passive: true });

/* idle */
let idleT = 0;
function resetIdle() { clearTimeout(idleT); idleT = window.setTimeout(() => botSay('Psst… I know every project he’s shipped. Ask me anything. 👀', 6000, 'happy'), 28000); }
addEventListener('pointermove', resetIdle, { passive: true });
resetIdle();

/* project hover */
let hoverT = 0;
document.addEventListener('pointerover', (e) => {
  const card = (e.target as Element).closest?.('[data-project]') as HTMLElement | null;
  clearTimeout(hoverT);
  if (!card) return;
  hoverT = window.setTimeout(() => {
    const id = card.dataset.project!;
    if (id === lastHoverProject) return;
    lastHoverProject = id;
    const name = card.querySelector('h3')?.textContent ?? 'this';
    if (Math.random() < 0.55) botSay(`Curious about <b>${name}</b>?`, 3800, '', { label: 'Ask how it was built', ask: `How did Csaba build ${name}? What was the interesting engineering part?` });
  }, 1400);
});

/* graph hover */
let graphCount = 0;
document.addEventListener('graph:hover', (e) => {
  graphCount++;
  if (graphCount === 6) botSay(`You found <b>${(e as CustomEvent).detail}</b>. Click a node to filter the projects by it.`, 4500, 'happy');
});

/* email copy */
document.addEventListener('copy', () => {
  if (String(getSelection()).includes('@')) botSay('Copying the email? Excellent decision. 📨', 3500, 'happy');
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && seen.size > 1) setTimeout(() => botSay('Welcome back! 👋', 2500, 'happy'), 400);
});

/* ---------------- chat ---------------- */
function esc(s: string) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!)); }
function md(s: string) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+|\/[^)\s]*|#[^)\s]*)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|\s)(me@raczcsaba\.dev)/g, '$1<a href="mailto:$2">$2</a>');
}
function addMsg(role: 'bot' | 'me' | 'sys', html: string) {
  const el = document.createElement('div');
  el.className = `msg msg--${role}`;
  el.innerHTML = html;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}
function render() {
  log.innerHTML = '';
  if (!history.length) {
    addMsg('bot', md('Hey! I’m **Bitsy**, Csaba’s AI sidekick. 👋 I know his projects, stack and the fun stuff.\n\nAsk me anything, or pitch me a project idea and I’ll tell you how he’d build it (and fill in the contact form for you).'));
  }
  for (const m of history) addMsg(m.role === 'user' ? 'me' : 'bot', md(m.content));
}

export function openChat(prefill?: string) {
  open = true;
  bot.classList.add('open');
  chat.setAttribute('aria-hidden', 'false');
  orb.setAttribute('aria-expanded', 'true');
  badge.hidden = true;
  bubble.classList.remove('on');
  if (!log.childElementCount) render();
  if (prefill) send(prefill);
  else setTimeout(() => input.focus(), 250);
}
function closeChat() {
  open = false;
  bot.classList.remove('open');
  chat.setAttribute('aria-hidden', 'true');
  orb.setAttribute('aria-expanded', 'false');
}

const fieldMap: Record<string, string> = { name: 'f-name', email: 'f-email', company: 'f-company', project_type: 'f-type', message: 'f-msg' };
function runAction(name: string, input: Record<string, unknown>) {
  if (name === 'fill_contact_form') {
    const filled: string[] = [];
    for (const [k, id] of Object.entries(fieldMap)) {
      const v = input[k];
      if (typeof v !== 'string' || !v.trim()) continue;
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (el instanceof HTMLSelectElement) {
        const opt = Array.from(el.options).find((o) => o.text.toLowerCase().includes(v.toLowerCase().split(' ')[0]));
        if (opt) el.value = opt.value;
      } else el.value = v.slice(0, el.maxLength > 0 ? el.maxLength : 5000);
      el.closest('.field')?.classList.add('filled');
      filled.push(k.replace('_', ' '));
    }
    const card = addMsg('sys', '');
    card.className = 'action-card';
    card.innerHTML = `<b>✓ Contact form filled</b> (${filled.join(', ')}). Review it and hit send. <a href="#contact" data-goto-contact>Take me there →</a>`;
    card.querySelector('[data-goto-contact]')?.addEventListener('click', (e) => { e.preventDefault(); goContact(); });
    if (innerWidth > 900) goContact(false);
  } else if (name === 'show_section') {
    const id = String(input.section || '');
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  } else if (name === 'open_project') {
    if (innerWidth < 700) closeChat();
    api.openProject(String(input.id || ''));
  }
}
function goContact(close = true) {
  if (close && innerWidth < 900) closeChat();
  document.getElementById('contact')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

async function send(text: string) {
  text = text.trim();
  if (!text || busy) return;
  if (/^sudo\s+hire\s+csaba/i.test(text)) {
    addMsg('me', esc(text));
    addMsg('bot', md('**Permission granted.** 🔓 Opening the fast lane: just email **me@raczcsaba.dev** with "sudo" in the subject and he’ll know you’re one of the curious ones.'));
    import('./eggs').then((m) => m.confetti());
    return;
  }
  busy = true;
  chips.style.display = 'none';
  history.push({ role: 'user', content: text });
  addMsg('me', esc(text));
  input.value = '';
  input.style.height = '';
  const out = addMsg('bot', '<span class="typing"><i></i><i></i><i></i></span>');
  bot.classList.add('talk');
  let acc = '';
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: history.slice(-16),
        context: { section: currentSection, project: (document.getElementById('sheet') as HTMLDialogElement)?.open ? (document.getElementById('sheet') as HTMLElement).dataset.project : lastHoverProject || undefined },
      }),
    });
    if (!res.ok || !res.body) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(j.error || `HTTP ${res.status}`);
    }
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buf = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      let i;
      while ((i = buf.indexOf('\n\n')) >= 0) {
        const line = buf.slice(0, i).replace(/^data: ?/, '');
        buf = buf.slice(i + 2);
        if (!line) continue;
        const ev = JSON.parse(line) as { t: string; v?: string; name?: string; input?: Record<string, unknown> };
        if (ev.t === 'text') { acc += ev.v; out.innerHTML = md(acc); log.scrollTop = log.scrollHeight; }
        else if (ev.t === 'action' && ev.name) runAction(ev.name, ev.input || {});
        else if (ev.t === 'error') throw new Error(ev.v);
      }
    }
    if (!acc) acc = '…';
    history.push({ role: 'assistant', content: acc });
    sessionStorage.setItem('bitsy', JSON.stringify(history.slice(-30)));
  } catch (err) {
    history.pop();
    const msg = String((err as Error).message || err);
    out.innerHTML = md(msg.length < 220 && !msg.startsWith('HTTP') ? msg : 'My brain is offline for a moment. 🔌 You can always reach Csaba at me@raczcsaba.dev.');
  } finally {
    busy = false;
    bot.classList.remove('talk');
  }
}

export function initBot(o: typeof api) {
  api = o;
  orb.addEventListener('click', () => (open ? closeChat() : openChat()));
  document.getElementById('chat-close')!.addEventListener('click', closeChat);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) closeChat(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });
  input.addEventListener('input', () => { input.style.height = ''; input.style.height = Math.min(120, input.scrollHeight) + 'px'; });
  chips.addEventListener('click', (e) => { const b = (e.target as Element).closest('button'); if (b) send(b.textContent || ''); });
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('[data-ask]') as HTMLElement | null;
    if (a) { e.preventDefault(); (document.getElementById('sheet') as HTMLDialogElement).close(); openChat(a.dataset.ask); return; }
    if ((e.target as Element).closest?.('[data-open-bot]')) openChat();
  });
  if (history.length) badge.hidden = true;
  setTimeout(() => { if (!open && !seen.has('work')) botSay('Hi! I’m Bitsy, Csaba’s AI. Drag the graph, or ask me anything. ✨', 6000, 'happy'); }, 2600);
}
