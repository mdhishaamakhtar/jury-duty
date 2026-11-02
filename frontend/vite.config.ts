import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Mumbai, next to the Supabase database.
			adapter: adapter({ regions: ['bom1'] })
		})
	],
	test: { include: ['src/**/*.test.ts'] }
});
