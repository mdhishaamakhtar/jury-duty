import { error, json } from '@sveltejs/kit';
import { undoVerdict } from '#lib/server/database.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const user = await locals.getUser();
	if (!user) error(401, 'Sign in again to continue');

	try {
		return json({ post: await undoVerdict(user.id) });
	} catch (cause) {
		if ((cause as { message?: string }).message?.includes('nothing_to_undo')) {
			error(409, 'That verdict can no longer be undone');
		}
		throw cause;
	}
};
