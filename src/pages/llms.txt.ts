import type { APIRoute } from 'astro';
import { SITE, person, projects } from '../data/profile';

export const GET: APIRoute = () => {
  const body = `# ${person.name} (${person.nativeName})

> ${person.title} in ${person.location}. ${person.short}

Contact: ${person.email} · GitHub: ${person.github} · CV (PDF): ${SITE}${person.pdf}
Status: ${person.available}

## Key pages
- [Portfolio](${SITE}/): projects, stack, journey, contact form, AI assistant
- [CV, printable](${SITE}/cv/): one-page resume (HTML)
- [CV, PDF](${SITE}${person.pdf})
- [Full profile for LLMs](${SITE}/llms-full.txt): every project, skill and role in plain text

## Selected work
${projects.filter((p) => p.featured).map((p) => `- ${p.name} (${p.period}): ${p.summary}`).join('\n')}
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
