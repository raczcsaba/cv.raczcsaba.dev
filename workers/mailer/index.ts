interface Env {
  EMAIL: { send(m: Record<string, unknown>): Promise<{ messageId: string }> };
  TO: string;
}
type Payload = { name: string; email: string; company?: string; type?: string; message: string; meta?: string };


const FROM = { email: 'cv@raczcsaba.dev', name: 'cv.raczcsaba.dev' };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'POST') return new Response('nope', { status: 405 });
    const p = (await req.json()) as Payload;
    const subject = `[cv] ${p.type ?? 'Message'} from ${p.name}${p.company ? ` (${p.company})` : ''}`.slice(0, 180);
    const text = `${p.message}\n\n— ${p.name} <${p.email}>${p.company ? `\nCompany: ${p.company}` : ''}\nType: ${p.type ?? '-'}\n${p.meta ?? ''}`;
    const html = `<div style="font:15px/1.55 system-ui,sans-serif;max-width:620px">
      <p style="white-space:pre-wrap">${esc(p.message)}</p><hr style="border:0;border-top:1px solid #ddd">
      <p><b>${esc(p.name)}</b> &lt;<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>&gt;<br>
      ${p.company ? `Company: ${esc(p.company)}<br>` : ''}Type: ${esc(p.type ?? '-')}</p>
      <p style="color:#888;font-size:12px">${esc(p.meta ?? '')}</p></div>`;
    try {
      const r = await env.EMAIL.send({ from: FROM, to: env.TO, replyTo: p.email, subject, text, html });
      return Response.json({ ok: true, id: r.messageId });
    } catch (e) {
      const err = e as { code?: string; message?: string };
      console.error('send failed', err.code, err.message);
      return Response.json({ ok: false, code: err.code ?? 'ERR', error: err.message }, { status: 502 });
    }
  },
};
