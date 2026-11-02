import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, locals }) => {
	// One path segment, so it matches the project's single-star redirect patterns.
	const { data, error: authError } = await locals.supabase.auth.signInWithOAuth({
		provider: 'google',
		options: { redirectTo: `${url.origin}/callback` }
	});
	if (authError || !data.url) error(500, 'Could not start sign in');
	redirect(303, data.url);
};
