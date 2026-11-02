import { defineConfig, devices } from '@playwright/test';
import { supabase } from './e2e/local.ts';

export default defineConfig({
	testDir: 'e2e',
	globalSetup: './e2e/setup.ts',
	fullyParallel: false,
	workers: 1,
	use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
	projects: [
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
		},
		{ name: 'phone', use: { ...devices['Pixel 7'] } }
	],
	webServer: {
		command: 'npm run build && npx vite preview --port 4173 --host 127.0.0.1',
		url: 'http://127.0.0.1:4173',
		timeout: 120000,
		reuseExistingServer: false,
		env: {
			PUBLIC_SUPABASE_URL: supabase.url,
			PUBLIC_SUPABASE_ANON_KEY: supabase.anonKey,
			SUPABASE_SERVICE_ROLE_KEY: supabase.serviceKey
		}
	}
});
