import { redirect } from '@sveltejs/kit';
import { isOwner, nextPost } from '#lib/server/database.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await locals.getUser();
	if (!user) redirect(303, '/');
	const [post, owner] = await Promise.all([nextPost(user.id), isOwner(user.id)]);
	return { post, owner };
};
