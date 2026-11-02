import { createServerClient } from '@supabase/ssr';
import type { BrowserContext } from '@playwright/test';
import { password, supabase } from './local.ts';

// Signs in the way the app's server does and hands the browser the same cookies.
export const signIn = async (context: BrowserContext, email: string) => {
	const jar = new Map<string, string>();
	const client = createServerClient(supabase.url, supabase.anonKey, {
		cookies: {
			getAll: () => [...jar].map(([name, value]) => ({ name, value })),
			setAll: (cookies) => {
				for (const { name, value } of cookies) jar.set(name, value);
			}
		}
	});
	const { error } = await client.auth.signInWithPassword({ email, password });
	if (error) throw error;
	await context.addCookies(
		[...jar].map(([name, value]) => ({ name, value, domain: '127.0.0.1', path: '/' }))
	);
};
