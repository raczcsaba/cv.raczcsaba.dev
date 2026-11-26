import { type Env, json, clientIp, rateLimit, sameOrigin } from '../_lib/common';

const TYPES = ['Job opportunity', 'Freelance project', 'AI / voice agent', 'Web or mobile app', 'Just saying hi'];

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ ok: false, error: 'bad origin' }, 403);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad json' }, 400);
  }
  const s = (k: string, max: number) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '');
  // honeypot: bots fill every field
  if (s('website', 200)) return json({ ok: true });
  const name = s('name', 120), email = s('email', 200), company = s('company', 160), message = s('message', 5000);
  const type = TYPES.includes(s('type', 40)) ? s('type', 40) : 'Message';
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email) || message.length < 10)
    return json({ ok: false, error: 'Please fill in name, a valid email and a message.' }, 400);

  const ip = clientIp(request);
  if (!(await rateLimit(env.CV_KV, `c:${ip}`, 5, 3600))) return json({ ok: false, error: 'Too many messages, try again later or email me@raczcsaba.dev.' }, 429);

  const meta = `Sent ${new Date().toISOString()} · ${request.headers.get('cf-ipcountry') ?? '?'} · ${(request.headers.get('user-agent') ?? '').slice(0, 120)}`;
  const payload = { name, email, company, type, message, meta };
  // keep a copy so nothing is lost if delivery fails
  await env.CV_KV.put(`msg:${Date.now()}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 * 90 });

  const r = await env.MAILER.fetch('https://mailer/send', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) return json({ ok: false, error: 'Delivery failed. Please email me@raczcsaba.dev directly.' }, 502);
  return json({ ok: true });
};
