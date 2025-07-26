<script lang="ts">
	import type { ContentItem } from '$lib/services/content';

	let { content }: { content: ContentItem } = $props();
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		
		<div class="bg-base-200 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
			<div class="text-center">
				<div class="text-lg leading-relaxed text-base-content max-w-2xl">
					{content.content}
				</div>
			</div>
		</div>
	</div>
</div>