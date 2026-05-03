import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lavj1462.github.io',
  integrations: [tailwind()],
});
