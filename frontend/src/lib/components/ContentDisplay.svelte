<script lang="ts">
	import type { ContentItem } from '$lib/services/content';

	let { content }: { content: ContentItem } = $props();
</script>

<div
	class="rounded-2xl border border-gray-200/50 bg-white/90 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md"
>
	<!-- Content header with context -->
	<div class="border-b border-gray-100 px-4 py-3 sm:px-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="h-2 w-2 rounded-full bg-rose-400"></div>
				<span class="text-sm font-medium text-gray-600">Content to Review</span>
			</div>
			<div class="flex items-center space-x-2 text-xs text-gray-500">
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>Review and classify</span>
			</div>
		</div>
	</div>

	<!-- Main content area -->
	<div class="p-4 sm:p-6 lg:p-8">
		<div
			class="post-text mx-auto max-w-sm text-left text-base leading-relaxed font-normal text-gray-800 selection:bg-rose-100 sm:max-w-2xl sm:text-lg lg:max-w-3xl lg:text-xl"
		>
			{content.content}
		</div>
	</div>

	<!-- Content footer with guidance -->
	<div class="border-t border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
		<div class="flex items-center justify-center space-x-2 text-center">
			<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
				/>
			</svg>
			<p class="text-xs font-light text-gray-500">
				Read carefully and choose TRUE or FALSE based on the guidelines
			</p>
		</div>
	</div>
</div>
