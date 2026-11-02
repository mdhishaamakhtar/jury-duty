import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (await locals.getUser()) redirect(303, '/label');
	return { signInFailed: url.searchParams.has('signin') };
};
