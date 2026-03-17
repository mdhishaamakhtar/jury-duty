<script lang="ts">
	import type { ContentItem } from '$lib/services/content';
	import FormattedText from './FormattedText.svelte';

	let { content }: { content: ContentItem } = $props();
</script>

<div
	class="animate-card-enter rounded-2xl border border-gray-200/50 bg-white/90 shadow-sm backdrop-blur-sm hover:shadow-md"
	style="transition: box-shadow 200ms var(--ease-out-quart);"
>
	<div class="p-6 sm:p-8 lg:p-10">
		<div
			class="post-text mx-auto max-w-sm text-base font-normal text-gray-800 selection:bg-rose-100 sm:max-w-2xl sm:text-lg lg:max-w-3xl lg:text-xl"
		>
			<FormattedText text={content.content} />
		</div>
	</div>
</div>
