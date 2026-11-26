import type { APIRoute } from 'astro';
import { knowledgeText } from '../data/profile';

export const GET: APIRoute = () => new Response(knowledgeText(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
