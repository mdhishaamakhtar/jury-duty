<script lang="ts">
	import LabelingScreen from '#lib/components/LabelingScreen.svelte';
	import { LabelingSession } from '#lib/labeling.svelte.ts';
	import { submitVerdict, undoLastVerdict } from '#lib/verdict-client.ts';

	let { data } = $props();

	// The session owns the post from here, so later page data must not replace it.
	// svelte-ignore state_referenced_locally
	const session = new LabelingSession(data.post, {
		submit: submitVerdict,
		undo: undoLastVerdict,
		reload: () => location.reload()
	});
</script>

<svelte:head>
	<title>Labeling · Jury Duty</title>
</svelte:head>

<LabelingScreen {session} owner={data.owner} />
