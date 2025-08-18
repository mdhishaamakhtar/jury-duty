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
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="guidelines-title"
		transition:fade={{ duration: 300 }}
	>
		<div
			class="relative my-8 flex max-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
			transition:scale={{ duration: 300, start: 0.92 }}
		>
			<!-- Enhanced Header -->
			<div
				class="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-rose-50 px-6 py-5"
			>
				<div class="flex items-center space-x-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
						<svg
							class="h-4 w-4 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div>
						<h2 id="guidelines-title" class="text-xl font-light text-gray-800">
							{LABELING_GUIDELINES.title}
						</h2>
						<p class="text-sm font-light text-gray-500">
							Essential guidelines for accurate labeling
						</p>
					</div>
				</div>
				<button
					class="btn btn-icon hover:bg-white/80"
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

			<!-- Enhanced Content -->
			<div class="flex-1 overflow-y-auto">
				<div class="px-6 py-8">
					<div class="post-text prose prose-gray max-w-none space-y-6 font-normal">
						{@html LABELING_GUIDELINES.content
							.replace(/\n/g, '<br>')
							.replace(
								/### /g,
								'<h3 class="text-lg font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-100">'
							)
							.replace(
								/## /g,
								'<h2 class="text-xl font-semibold text-gray-800 mt-10 mb-5 pb-3 border-b-2 border-rose-100">'
							)
							.replace(
								/\*\*(.*?)\*\*/g,
								'<strong class="font-medium text-gray-900 bg-gray-50 px-1 py-0.5 rounded">$1</strong>'
							)
							.replace(/\*(.*?)\*/g, '<em class="text-gray-700">$1</em>')
							.replace(
								/(\d+\. \*\*.*?\*\*)/g,
								'<div class="mt-4 mb-3 p-3 bg-rose-50 rounded-lg border-l-4 border-rose-200">$1</div>'
							)
							.replace(/- /g, '• ')}
					</div>
				</div>

				<!-- Quick reference card -->
				<div class="mx-6 mb-6 rounded-xl border border-gray-200 bg-rose-50 p-4">
					<div class="mb-3 flex items-center space-x-2">
						<svg
							class="h-4 w-4 text-rose-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h4 class="text-sm font-medium text-gray-800">Quick Reference</h4>
					</div>
					<div class="grid grid-cols-2 gap-4 text-xs">
						<div class="space-y-1">
							<div class="flex items-center space-x-2">
								<span class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
									<svg
										class="h-2.5 w-2.5 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</span>
								<span class="text-gray-600">Choose TRUE when content meets criteria</span>
							</div>
						</div>
						<div class="space-y-1">
							<div class="flex items-center space-x-2">
								<span class="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500">
									<svg
										class="h-2.5 w-2.5 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</span>
								<span class="text-gray-600">Choose FALSE when content doesn't meet criteria</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Enhanced Footer -->
			<div class="flex-shrink-0 border-t border-gray-200 bg-gray-50/50 px-6 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2 text-xs text-gray-500">
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Keep these guidelines in mind while labeling</span>
					</div>
					<button class="btn btn-primary btn-lg" onclick={onClose}> Ready to Label </button>
				</div>
			</div>
		</div>
	</div>
{/if}
