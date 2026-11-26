# cv.raczcsaba.dev

Interactive portfolio of **Csaba Rácz**, full-stack & AI engineer. Live at **[cv.raczcsaba.dev](https://cv.raczcsaba.dev)**.

- **Astro** static site, zero-framework TypeScript, scroll-driven CSS animations, View Transitions
- **Three.js** skill graph: every node is a skill, edges link skills used together in real projects. Drag it, hover it, click to filter the work.
- **Bitsy**, a Claude-powered assistant (Cloudflare Pages Function, streamed SSE, tool use). It knows the profile, reacts to the cursor and scrolling, and drafts a message into the contact form when a visitor has a project idea. Spend is metered in KV with a hard budget cap.
- **Contact form** goes through a Pages Function to a small Worker using Cloudflare Email Service.
- **SEO and AI search**: JSON-LD `@graph` (Person, ProfilePage, projects), `llms.txt` / `llms-full.txt`, an AI-crawler-friendly `robots.txt`, sitemap, and an OG image.
- Printable CV at `/cv/` and a generated PDF (`npm run pdf`, headless Chrome).
- A few easter eggs. Press `?` on the site.

All content lives in [`src/data/profile.ts`](src/data/profile.ts), which feeds the page, the PDF, `llms.txt` and the bot.

## Develop

```bash
nvm use 22
npm install
npm run dev               # site only
npm run build && npx wrangler pages dev dist   # site + functions (put ANTHROPIC_API_KEY in .dev.vars)
npm run pdf               # regenerate PDF, og.png and icons
```

## Deploy (Cloudflare)

```bash
cd workers/mailer && cp -n wrangler.example.toml wrangler.toml && npx wrangler deploy && cd -        # contact-form mailer
npx wrangler pages secret put ANTHROPIC_API_KEY --project-name cv-raczcsaba
npm run deploy
```

MIT licensed code. The personal content (texts, CV) is © Csaba Rácz.
