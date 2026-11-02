<script lang="ts">
	import LabelingScreen from '#lib/components/LabelingScreen.svelte';
	import { jury } from '#lib/jury.config.ts';
	import { LabelingSession } from '#lib/labeling.svelte.ts';
	import type { Post } from '#lib/types.ts';

	// Nothing here reaches a server. Verdicts live in this page and vanish on reload.
	const posts = jury.samples;
	let index = 0;

	const postAt = (position: number): Post | null =>
		position < posts.length
			? {
					id: `demo-${position}`,
					content: posts[position],
					labeled_count: position,
					remaining_count: posts.length - position
				}
			: null;

	const session = new LabelingSession(postAt(0), {
		submit: async () => {
			index += 1;
			return { kind: 'saved', next: postAt(index) };
		},
		undo: async () => {
			index -= 1;
			return postAt(index);
		},
		reload: () => location.reload()
	});
</script>

<svelte:head>
	<title>Demo · Jury Duty</title>
	<meta name="description" content="Try Jury Duty with made-up posts. No sign-in needed." />
</svelte:head>

<LabelingScreen {session} demo />
