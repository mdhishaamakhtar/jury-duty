import { createServerClient } from '@supabase/ssr';
import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookies) => {
				for (const { name, value, options } of cookies) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});

	// getUser checks the token with Supabase, so a forged cookie is rejected.
	event.locals.getUser = async () => {
		const { data, error } = await event.locals.supabase.auth.getUser();
		return error ? null : data.user;
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-range'
	});
};

export const handleError: HandleServerError = ({ error, event }) => {
	const { status, message } = error as { status?: number; message?: string };
	// 404s and refused requests are expected, so only real failures reach the logs.
	if (status && status < 500) return { message: message ?? 'Not found' };

	// Supabase errors are plain objects, so they need formatting to be readable in the logs.
	// eslint-disable-next-line no-console -- server logs are the only record of these
	console.error(event.url.pathname, JSON.stringify(error, Object.getOwnPropertyNames(error)));
	return { message: 'Something went wrong' };
};
