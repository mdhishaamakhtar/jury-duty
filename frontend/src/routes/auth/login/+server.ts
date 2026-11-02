import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, locals }) => {
	const { data, error: authError } = await locals.supabase.auth.signInWithOAuth({
		provider: 'google',
		options: { redirectTo: `${url.origin}/auth/callback` }
	});
	if (authError || !data.url) error(500, 'Could not start sign in');
	redirect(303, data.url);
};
