import { initBot, botSay } from './bot';
import { initEggs } from './eggs';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ---------- nav hide on scroll + active link ---------- */
{
  const nav = $('#nav');
  let last = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('nav--hidden', y > 300 && y > last + 4);
    if (y < last - 4) nav.classList.remove('nav--hidden');
    last = y;
  }, { passive: true });
  const links = $$<HTMLAnchorElement>('.nav__link[href^="#"]');
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.hash === '#' + e.target.id)));
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'stack', 'journey', 'lab', 'contact'].forEach((id) => io.observe($('#' + id)));
}

/* ---------- reveal fallback (no scroll-timeline support) ---------- */
if (!CSS.supports('animation-timeline: view()')) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
}

/* ---------- card spotlight ---------- */
if (finePointer) {
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as Element).closest?.('.card') as HTMLElement | null;
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - r.left}px`);
    card.style.setProperty('--y', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* magnetic buttons */
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--bx', `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
      el.style.setProperty('--by', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--bx', '0px'); el.style.setProperty('--by', '0px'); });
  });

  /* hero glow follows pointer */
  const hero = $('.hero');
  const glow = $('.hero__glow');
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    glow.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    glow.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true });
}

/* ---------- word rotator ---------- */
{
  const words = ['talk', 'think', 'listen', 'sell', 'learn', 'delight'];
  const el = $('#rotator');
  let i = 0;
  if (!reduced) setInterval(() => {
    i = (i + 1) % words.length;
    el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-60%)', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.6,0,.8,.4)' }).onfinish = () => {
      el.textContent = words[i];
      el.animate([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.16,.84,.3,1)' });
    };
  }, 2600);
}

/* ---------- counters ---------- */
{
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target as HTMLElement;
    const n = Number(el.dataset.count), suf = el.dataset.suffix ?? '';
    if (reduced) return;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(n * (1 - Math.pow(1 - p, 4))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => io.observe(el));
}

/* ---------- project filters + sheet ---------- */
type P = { id: string; name: string; client: string; period: string; role: string; summary: string; highlights: string[]; stack: string[]; links?: { label: string; url: string }[]; color: string; label: string };
const projects: P[] = JSON.parse($('#projects-json').innerHTML);
const cards = $$<HTMLButtonElement>('[data-project]');
const filterBtns = $$<HTMLButtonElement>('[data-filter]');

export function filterProjects(key: string, bySkill = false) {
  const run = () => {
    cards.forEach((c) => {
      const show = key === 'all' || (bySkill ? (c.dataset.stack ?? '').split('|').includes(key) : (c.dataset.tags ?? '').split(' ').includes(key));
      c.hidden = !show;
    });
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(!bySkill && b.dataset.filter === key)));
  };
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !reduced) d.startViewTransition(run); else run();
}
filterBtns.forEach((b) => b.addEventListener('click', () => filterProjects(b.dataset.filter!)));
cards.forEach((c, i) => ((c.style as CSSStyleDeclaration & { viewTransitionName: string }).viewTransitionName = `p${i}`));

const sheet = $<HTMLDialogElement>('#sheet');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
export function openProject(id: string) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;
  $('#sheet-body').innerHTML = `
    <span class="eyebrow" style="color:${p.color}">${esc(p.label)}</span>
    <h3 id="sheet-title">${esc(p.name)}</h3>
    <div class="meta"><span>${esc(p.client)}</span><span>${esc(p.period)}</span><span>${esc(p.role)}</span></div>
    <p class="lead" style="max-width:none">${esc(p.summary)}</p>
    <ul style="--c:${p.color}">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    <div class="chips" style="padding-top:0">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    ${p.links?.length ? `<div class="sheet__links" style="margin-top:22px">${p.links.map((l) => `<a class="btn btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>` : ''}
    <div class="sheet__ask">Curious how it was built? <button class="btn btn--sm btn--primary" type="button" data-ask="Tell me more about how Csaba built ${esc(p.name)}">Ask the AI about ${esc(p.name)}</button></div>`;
  sheet.showModal();
  sheet.dataset.project = id;
}
cards.forEach((c) => c.addEventListener('click', () => openProject(c.dataset.project!)));
sheet.addEventListener('click', (e) => { if (e.target === sheet || (e.target as Element).closest('[data-close]')) sheet.close(); });

/* ---------- timeline progress ---------- */
{
  const tl = $('#tl');
  const items = $$('.tl__item', tl);
  const onScroll = () => {
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    tl.style.setProperty('--p', String(p));
    items.forEach((it) => it.classList.toggle('lit', it.getBoundingClientRect().top < innerHeight * 0.6));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- fun facts ---------- */
{
  const facts: string[] = JSON.parse($('#facts-json').textContent!);
  let i = 0;
  const el = $('#fact'), count = $('#fact-count');
  $('#fact-next').addEventListener('click', () => {
    i = (i + 1) % facts.length;
    el.innerHTML = `<span>${esc(facts[i])}</span>`;
    count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(facts.length).padStart(2, '0')}`;
    if (i === facts.length - 1) botSay('That’s the last one I’m allowed to show. Ask me for the classified ones. 🤫', 5000);
  });
}

/* ---------- bookshelf & record crate ---------- */
function picker(root: HTMLElement, sel: string, onPick: (i: number) => void) {
  const items = [...root.querySelectorAll<HTMLElement>(sel)];
  const pick = (i: number, focus = false) => {
    items.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    if (focus) items[i].focus();
    items[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    onPick(i);
  };
  items.forEach((b, k) => { b.tabIndex = k === 0 ? 0 : -1; b.addEventListener('click', () => pick(k)); });
  root.addEventListener('keydown', (e) => {
    const cur = items.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    pick((cur + d + items.length) % items.length, true);
  });
}
{
  type Book = { title: string; hu: string; author: string; year: number | string; note: string };
  const books: Book[] = JSON.parse($('#books-json').textContent!);
  const card = $('#book-card');
  picker($('.shelf__rack'), '.spine', (i) => {
    const b = books[i];
    card.style.setProperty('--bc', (b as Book & { color: string }).color);
    card.innerHTML = `<span class="mono shelf__meta">${esc(b.author)} · ${esc(String(b.year))}</span><h3>${esc(b.title)}</h3><p class="shelf__hu">${esc(b.hu)}</p><p class="shelf__note">${esc(b.note)}</p>`;
  });
}
{
  type Rec = { track: string; artist: string; genre: string; color: string };
  const recs: Rec[] = JSON.parse($('#records-json').textContent!);
  const crate = $('#crate'), row = $('#cf-row'), info = $('.player__info');
  const items = $$<HTMLButtonElement>('.cf__item', row);
  const play = $<HTMLAnchorElement>('#rec-play');
  const n = items.length;
  const clamp = (v: number, lo = 0, hi = n - 1) => Math.min(hi, Math.max(lo, v));
  // Position is driven by us (not native scroll-snap): `pos` eases toward `target`, both in disc units.
  let cur = -1, spread = reduced ? 1 : 0, raf = 0, last = 0;
  let pos = Math.floor(n / 2), target = pos;
  const stepPx = () => items[0].offsetWidth * 0.58;

  const go = (i: number) => { target = ((Math.round(i) % n) + n) % n; if (reduced) pos = target; queue(); };

  function select(i: number) {
    if (i === cur) return;
    cur = i;
    const r = recs[i];
    items.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    crate.style.setProperty('--cur', r.color);
    crate.style.setProperty('--prog', `${((i + 1) / n) * 100}%`);
    $('#rec-genre').textContent = `Now spinning · ${r.genre}`;
    $('#rec-track').textContent = r.track;
    $('#rec-artist').textContent = r.artist;
    $('#rec-pos').textContent = `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
    play.href = `https://tidal.com/search?q=${encodeURIComponent(`${r.artist.split(' · ')[0]} ${r.track}`)}`;
    play.setAttribute('aria-label', `Play ${r.track} on Tidal`);
  }

  function layout(t: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
    last = t;
    if (!dragging) {
      pos += (target - pos) * (1 - Math.exp(-dt * 11));
      if (Math.abs(target - pos) < 0.002) pos = target;
    }
    if (!reduced) { // stack -> fan out as the card scrolls into view
      const top = crate.getBoundingClientRect().top;
      spread = Math.min(1, Math.max(0, (innerHeight * 0.95 - top) / (innerHeight * 0.55)));
    }
    const step = stepPx();
    items.forEach((el, k) => {
      const d = k - pos;
      const a = Math.abs(d);
      const c = Math.min(a, 5);
      const ease = Math.sign(d) * Math.min(a, 1) * -step * 0.12; // tuck neighbours slightly behind
      el.style.transform = `translateX(${(d * step + ease) * spread}px) translateZ(${-c * 70}px) rotateY(${Math.max(-1, Math.min(1, d)) * -38 * spread}deg) scale(${1 - c * 0.06})`;
      el.style.zIndex = String(100 - Math.round(a * 10));
      el.style.filter = `brightness(${1 - c * 0.15})`;
      el.style.opacity = String(Math.max(0, Math.min(1, 5.5 - a)));
    });
    select(clamp(Math.round(pos)));
    if (pos !== target || dragging) queue(); else last = 0;
  }
  function queue() { if (!raf) raf = requestAnimationFrame(layout); }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);

  // mouse wheel / trackpad: one notch = one disc; vertical wheel passes to the page at either end
  let wheelT = 0;
  row.addEventListener('wheel', (e) => {
    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const delta = (horiz ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 33 : 1);
    if (!delta) return;
    if (!horiz && ((delta < 0 && target <= 0) || (delta > 0 && target >= n - 1))) return;
    e.preventDefault();
    target = clamp(target + Math.sign(delta) * Math.min(1, Math.abs(delta) / 100));
    clearTimeout(wheelT);
    wheelT = window.setTimeout(() => { target = clamp(Math.round(target)); queue(); }, 120);
    if (reduced) pos = target;
    queue();
  }, { passive: false });

  // drag / swipe (mouse, pen, touch); vertical page scrolling on touch stays native via touch-action: pan-y
  let dragging = false, downX = 0, downPos = 0, lastX = 0, lastT = 0, vel = 0, moved = false, pid = -1;
  row.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pid = e.pointerId; downX = lastX = e.clientX; lastT = e.timeStamp; downPos = pos; vel = 0; moved = false;
  });
  row.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    if (!moved && Math.abs(e.clientX - downX) < 6) return;
    if (!moved) { moved = dragging = true; row.setPointerCapture(pid); row.classList.add('drag'); }
    const step = stepPx();
    let p = downPos - (e.clientX - downX) / step;
    if (p < 0) p *= 0.35; else if (p > n - 1) p = n - 1 + (p - n + 1) * 0.35; // rubber-band past the ends
    const dt = Math.max(1, e.timeStamp - lastT);
    vel = 0.8 * (-(e.clientX - lastX) / step / dt) + 0.2 * vel; // discs per ms
    lastX = e.clientX; lastT = e.timeStamp;
    pos = target = p;
    queue();
  });
  const release = (e: PointerEvent) => {
    if (e.pointerId !== pid) return;
    pid = -1;
    if (!dragging) return;
    dragging = false; row.classList.remove('drag');
    if (e.timeStamp - lastT > 80) vel = 0; // held still before letting go: no fling
    target = clamp(Math.round(pos + Math.max(-3, Math.min(3, vel * 120))));
    queue();
  };
  row.addEventListener('pointerup', release);
  row.addEventListener('pointercancel', release);
  // a drag ends with a click on whatever disc is under the pointer: swallow it
  row.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

  items.forEach((b, k) => b.addEventListener('click', () => (k === cur && target === cur ? play.click() : go(k))));
  $('#rec-prev').addEventListener('click', () => go(target - 1));
  $('#rec-next').addEventListener('click', () => go(target + 1));
  row.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(target + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(target - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(n - 1); }
    else if (e.key === 'Enter' && e.target === row) play.click();
  });
  // Bitsy's speech bubble sits bottom-right, right over the player controls: get it out of the way
  $('.player').addEventListener('pointerenter', () => document.getElementById('bubble')?.classList.remove('on'));
  queue();
}

/* ---------- contact form ---------- */
{
  const form = $<HTMLFormElement>('#contact-form');
  const note = $('#form-note');
  form.addEventListener('input', (e) => (e.target as Element).closest('.field')?.classList.remove('filled'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.name?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? '') || (data.message ?? '').trim().length < 10) {
      note.className = 'form__note err';
      note.textContent = 'Please add your name, a valid email and a message (10+ characters).';
      return;
    }
    const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    btn.disabled = true;
    note.className = 'form__note';
    note.textContent = 'Sending…';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!r.ok || !j.ok) throw new Error(j.error || 'failed');
      note.className = 'form__note ok';
      note.textContent = 'Sent! I usually reply within a day.';
      form.reset();
      form.querySelectorAll('.filled').forEach((f) => f.classList.remove('filled'));
      botSay('Message delivered. 📬 Csaba will get back to you soon!', 5000, 'happy');
      import('./eggs').then((m) => m.confetti());
    } catch {
      note.className = 'form__note err';
      note.innerHTML = `Couldn’t send right now. Email me directly at <a href="mailto:me@raczcsaba.dev" style="text-decoration:underline">me@raczcsaba.dev</a>.`;
    } finally {
      btn.disabled = false;
    }
  });
}

/* ---------- 3D graph: lazy, only when visible and allowed ---------- */
{
  const host = $('#graph');
  const start = () =>
    import('./graph').then((m) => m.initGraph(host, $('#graph-tip'), {
      onSkill: (name: string) => {
        filterProjects(name, true);
        botSay(`Showing projects that use <b>${esc(name)}</b>. Scroll down 👇`, 4500);
        document.getElementById('work')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      },
    }));
  const lowEnd = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 2;
  if (!lowEnd) {
    const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 300));
    if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
  }
}

initBot({ openProject });
initEggs();
