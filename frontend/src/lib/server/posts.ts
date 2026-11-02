import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$app/env/private';
import { PUBLIC_SUPABASE_URL } from '$app/env/public';
import type { Post, Verdict } from '#lib/types.ts';

// The service key stays on the server. Every call passes the signed-in user's id.
const admin = () =>
	createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false, autoRefreshToken: false }
	});

export const nextPost = async (userId: string): Promise<Post | null> => {
	const { data, error } = await admin().rpc('get_next_unlabeled_post', { uid: userId });
	if (error) throw error;
	return data?.[0] ?? null;
};

export const castVerdict = async (
	userId: string,
	postId: string,
	verdict: Verdict
): Promise<Post | null> => {
	const { data, error } = await admin().rpc('cast_verdict', {
		uid: userId,
		post: postId,
		verdict
	});
	if (error) throw error;
	return data?.[0] ?? null;
};
