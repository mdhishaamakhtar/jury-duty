<script lang="ts">
	import { LABELING_GUIDELINES } from '$lib/config/guidelines';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open = false, onClose }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleEscapeKey(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleEscapeKey} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="guidelines-title"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative my-8 flex max-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Header -->
			<div
				class="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4"
			>
				<h2 id="guidelines-title" class="text-xl font-light text-gray-800">
					{LABELING_GUIDELINES.title}
				</h2>
				<button
					class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:text-gray-600 active:scale-95"
					onclick={onClose}
					aria-label="Close guidelines"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto px-6 py-6">
				<div class="post-text prose prose-gray max-w-none font-normal">
					{@html LABELING_GUIDELINES.content
						.replace(/\n/g, '<br>')
						.replace(/### /g, '<h3 class="text-lg font-medium text-gray-800 mt-6 mb-3">')
						.replace(/## /g, '<h2 class="text-xl font-medium text-gray-800 mt-8 mb-4">')
						.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>')
						.replace(/\*(.*?)\*/g, '<em>$1</em>')
						.replace(/(\d+\. \*\*.*?\*\*)/g, '<div class="mt-3 mb-2">$1</div>')
						.replace(/- /g, '• ')}
				</div>
			</div>

			<!-- Footer -->
			<div class="flex-shrink-0 border-t border-gray-200 px-6 py-4">
				<div class="flex justify-end">
					<button
						class="btn rounded-full border border-gray-200 bg-white/80 px-6 py-2 font-light text-gray-700 transition-all duration-200 hover:scale-105 hover:border-gray-300 hover:bg-white active:scale-95"
						onclick={onClose}
					>
						Got it
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
