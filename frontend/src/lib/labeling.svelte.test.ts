import { describe, expect, it, vi } from 'vitest';
import { LabelingSession, type LabelingDeps } from './labeling.svelte.ts';
import type { Post } from './types.ts';

const post = (id: string, labeled = 10): Post => ({
	id,
	content: 'text',
	labeled_count: labeled,
	remaining_count: 90
});

const setup = (submit: LabelingDeps['submit']) => {
	const reload = vi.fn();
	return {
		reload,
		session: new LabelingSession(post('a'), { submit, reload, wait: async () => {} })
	};
};

describe('LabelingSession', () => {
	it('moves to the next post after a save', async () => {
		const { session } = setup(async () => ({ kind: 'saved', next: post('b', 11) }));
		await session.cast('TRUE');
		expect(session.post?.id).toBe('b');
		expect(session.pending).toBeNull();
		expect(session.leaving).toBe(false);
	});

	it('finishes when no post is left', async () => {
		const { session } = setup(async () => ({ kind: 'saved', next: null }));
		await session.cast('FALSE');
		expect(session.post).toBeNull();
	});

	it('ignores a second verdict while saving', async () => {
		const submit = vi.fn(async () => ({ kind: 'saved', next: post('b') }) as const);
		const { session } = setup(submit);
		await Promise.all([session.cast('TRUE'), session.cast('FALSE')]);
		expect(submit).toHaveBeenCalledTimes(1);
		expect(submit).toHaveBeenCalledWith('a', 'TRUE');
	});

	it('keeps the post and verdict when a save fails', async () => {
		const { session } = setup(async () => {
			throw new Error('offline');
		});
		await session.cast('TRUE');
		expect(session.post?.id).toBe('a');
		expect(session.failed).toBe('TRUE');
	});

	it('blocks new verdicts until a failed save is resolved', async () => {
		const submit = vi.fn(async () => {
			throw new Error('offline');
		});
		const { session } = setup(submit);
		await session.cast('TRUE');
		await session.cast('FALSE');
		expect(submit).toHaveBeenCalledTimes(1);
	});

	it('retries the same verdict', async () => {
		const submit = vi
			.fn<LabelingDeps['submit']>()
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce({ kind: 'saved', next: post('b') });
		const { session } = setup(submit);
		await session.cast('FALSE');
		await session.retry();
		expect(submit).toHaveBeenLastCalledWith('a', 'FALSE');
		expect(session.post?.id).toBe('b');
		expect(session.failed).toBeNull();
	});

	it.each(['conflict', 'signed-out'] as const)('reloads on %s', async (kind) => {
		const { session, reload } = setup(async () => ({ kind }));
		await session.cast('TRUE');
		expect(reload).toHaveBeenCalledOnce();
	});

	it('reports progress', () => {
		const { session } = setup(async () => ({ kind: 'conflict' }));
		expect(session.total).toBe(100);
		expect(session.percent).toBe(10);
	});
});
