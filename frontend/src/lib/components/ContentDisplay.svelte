<script lang="ts">
	import type { ContentItem } from '$lib/services/content';

	let { content }: { content: ContentItem } = $props();
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="bg-base-200 flex min-h-[200px] items-center justify-center rounded-lg p-6">
			<div class="text-center">
				<div class="text-base-content max-w-2xl text-lg leading-relaxed">
					{content.content}
				</div>
			</div>
		</div>
	</div>
</div>
