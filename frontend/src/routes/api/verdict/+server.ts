import { error, json } from '@sveltejs/kit';
import { castVerdict } from '#lib/server/database.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = await locals.getUser();
	if (!user) error(401, 'Sign in again to continue');

	const { postId, verdict } = await request.json();
	if (typeof postId !== 'string' || (verdict !== 'TRUE' && verdict !== 'FALSE')) {
		error(400, 'Invalid verdict');
	}

	try {
		return json({ next: await castVerdict(user.id, postId, verdict) });
	} catch (cause) {
		// The open post changed, for example in another tab. Nothing was saved, so reload it.
		const message = (cause as { message?: string }).message ?? '';
		if (message.includes('post_not_open') || message.includes('already_decided')) {
			error(409, 'This post has changed');
		}
		throw cause;
	}
};
