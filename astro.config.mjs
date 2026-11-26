import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cv.raczcsaba.dev',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always', format: 'directory' },
  compressHTML: true,
  prefetch: false,
  vite: {
    build: { target: 'es2022', cssMinify: 'lightningcss' },
  },
});
