import type { SubmitResult } from './labeling.svelte.ts';
import type { Post, Verdict } from './types.ts';

export const submitVerdict = async (postId: string, verdict: Verdict): Promise<SubmitResult> => {
	const response = await fetch('/api/verdict', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ postId, verdict })
	});
	if (response.status === 401) return { kind: 'signed-out' };
	if (response.status === 409) return { kind: 'conflict' };
	if (!response.ok) throw new Error(`Save failed with ${response.status}`);
	return { kind: 'saved', next: (await response.json()).next };
};

export const undoLastVerdict = async (): Promise<Post | null> => {
	const response = await fetch('/api/verdict/undo', { method: 'POST' });
	if (!response.ok) throw new Error(`Undo failed with ${response.status}`);
	return (await response.json()).post;
};
