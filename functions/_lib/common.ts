export interface Env {
  ANTHROPIC_API_KEY: string;
  CHAT_MODEL?: string;
  BUDGET_USD?: string;
  CV_KV: KVNamespace;
  MAILER: Fetcher;
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

export const clientIp = (req: Request) => req.headers.get('cf-connecting-ip') || 'unknown';

/** Fixed-window counter in KV. Approximate (KV is eventually consistent), good enough for a CV site. */
export async function rateLimit(kv: KVNamespace, key: string, limit: number, windowSec: number): Promise<boolean> {
  const bucket = Math.floor(Date.now() / 1000 / windowSec);
  const k = `rl:${key}:${bucket}`;
  const n = Number((await kv.get(k)) || 0);
  if (n >= limit) return false;
  await kv.put(k, String(n + 1), { expirationTtl: Math.max(60, windowSec * 2) });
  return true;
}

export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients still go through rate limits
  const host = new URL(req.url).host;
  try {
    const o = new URL(origin).host;
    return o === host || o.endsWith('.cv-raczcsaba.pages.dev') || o.startsWith('localhost') || o.startsWith('127.0.0.1');
  } catch {
    return false;
  }
}
