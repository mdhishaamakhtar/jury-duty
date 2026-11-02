import type { Post, Verdict } from './types.ts';

export type SubmitResult =
	{ kind: 'saved'; next: Post | null } | { kind: 'signed-out' } | { kind: 'conflict' };

export interface LabelingDeps {
	submit: (postId: string, verdict: Verdict) => Promise<SubmitResult>;
	reload: () => void;
	wait?: (ms: number) => Promise<void>;
}

const FEEDBACK_MS = 260;
const LEAVE_MS = 170;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export class LabelingSession {
	post = $state<Post | null>(null);
	pending = $state<Verdict | null>(null);
	failed = $state<Verdict | null>(null);
	leaving = $state(false);

	readonly #deps: LabelingDeps;
	readonly #wait: (ms: number) => Promise<void>;

	constructor(post: Post | null, deps: LabelingDeps) {
		this.post = post;
		this.#deps = deps;
		this.#wait = deps.wait ?? sleep;
	}

	get total() {
		return this.post ? this.post.labeled_count + this.post.remaining_count : 0;
	}

	get percent() {
		return this.post && this.total ? (this.post.labeled_count / this.total) * 100 : 0;
	}

	async cast(verdict: Verdict): Promise<void> {
		if (this.pending || this.failed || !this.post) return;
		this.pending = verdict;
		const started = Date.now();
		try {
			const result = await this.#deps.submit(this.post.id, verdict);
			if (result.kind !== 'saved') {
				this.#deps.reload();
				return;
			}
			await this.#wait(Math.max(0, FEEDBACK_MS - (Date.now() - started)));
			this.leaving = true;
			await this.#wait(LEAVE_MS);
			this.post = result.next;
			this.pending = null;
			this.leaving = false;
		} catch {
			this.pending = null;
			this.failed = verdict;
		}
	}

	retry(): Promise<void> {
		const verdict = this.failed;
		this.failed = null;
		return verdict ? this.cast(verdict) : Promise.resolve();
	}
}
