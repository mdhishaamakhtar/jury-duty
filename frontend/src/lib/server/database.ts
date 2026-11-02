import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$app/env/private';
import { PUBLIC_SUPABASE_URL } from '$app/env/public';
import type { Rating } from '#lib/agreement.ts';
import type { Post, Verdict } from '#lib/types.ts';

// The service key stays on the server. Callers pass the signed-in user's id.
const admin = () =>
	createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false, autoRefreshToken: false }
	});

const call = async <Row>(name: string, args: Record<string, unknown> = {}): Promise<Row[]> => {
	const { data, error } = await admin().rpc(name, args);
	if (error) throw error;
	return data ?? [];
};

export interface ExportRow {
	id: string;
	post: string;
	content: string | null;
	rater: string;
	label: string;
	labeled_at: string | null;
}

export const nextPost = async (userId: string) =>
	(await call<Post>('get_next_unlabeled_post', { uid: userId }))[0] ?? null;

export const castVerdict = async (userId: string, postId: string, verdict: Verdict) =>
	(await call<Post>('cast_verdict', { uid: userId, post: postId, verdict }))[0] ?? null;

export const undoVerdict = async (userId: string) =>
	(await call<Post>('undo_last_verdict', { uid: userId }))[0] ?? null;

export const isOwner = async (userId: string) => {
	const { data, error } = await admin().rpc('is_project_owner', { uid: userId });
	if (error) throw error;
	return data === true;
};

export const projectResults = async () => {
	const [[totals], raters, overlap, disagreements] = await Promise.all([
		call<{
			posts: number;
			labeled_posts: number;
			verdicts: number;
			true_verdicts: number;
			raters: number;
		}>('project_totals'),
		call<{ rater: string; email: string | null; verdicts: number; true_verdicts: number }>(
			'project_raters'
		),
		call<Rating>('project_overlap'),
		call<{ post: string; content: string; true_votes: number; false_votes: number }>(
			'project_disagreements',
			{ max_rows: 50 }
		)
	]);
	return { totals, raters, overlap, disagreements };
};

export const exportPage = (afterId: string | null, maxRows: number) =>
	call<ExportRow>('project_export', { after_id: afterId, max_rows: maxRows });
