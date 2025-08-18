<script lang="ts">
	import { contentStore } from '$lib/stores/content';
	import { onMount } from 'svelte';

	let {
		onLabelSubmit,
		showFull = false
	}: { onLabelSubmit?: (label: string) => void; showFull?: boolean } = $props();

	const state = $derived($contentStore);
	let needsScroll = $state(false);

	onMount(() => {
		function checkScroll() {
			// Check if page content is taller than viewport
			needsScroll = document.documentElement.scrollHeight > window.innerHeight;
		}

		checkScroll();
		window.addEventListener('resize', checkScroll);

		// Also check when content changes
		const observer = new MutationObserver(checkScroll);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener('resize', checkScroll);
			observer.disconnect();
		};
	});

	async function handleLabelSubmit(label: string) {
		await contentStore.submitLabel(label);
		onLabelSubmit?.(label);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (state.submittingLabel) return;

		if (event.key === '1' || event.key === 'ArrowLeft' || event.key === 't' || event.key === 'T') {
			event.preventDefault();
			handleLabelSubmit('TRUE');
		} else if (
			event.key === '2' ||
			event.key === 'ArrowRight' ||
			event.key === 'f' ||
			event.key === 'F'
		) {
			event.preventDefault();
			handleLabelSubmit('FALSE');
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Sticky buttons when content exists - responsive design -->
{#if state.currentContent && !showFull}
	<!-- Mobile: smaller, simpler. Desktop: always show inline -->
	<div
		class="
		{needsScroll ? 'fixed right-0 bottom-0 left-0 z-50 lg:relative lg:mt-8' : 'relative'} 
		border-t border-gray-200/50 bg-white/95 backdrop-blur-md
		{needsScroll
			? 'p-4 sm:p-5 lg:rounded-2xl lg:border lg:p-6 lg:shadow-sm lg:transition-shadow lg:duration-300 lg:hover:shadow-md'
			: 'mt-8 rounded-2xl border border-gray-200/50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md'}
	"
	>
		<!-- Mobile/Tablet layout - compact for scrolling -->
		<div class="mx-auto block lg:hidden">
			<div class="mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-4">
				<button
					class="btn btn-success btn-md group sm:btn-lg flex min-h-[3rem] items-center justify-center space-x-2 backdrop-blur-sm sm:min-h-[3.5rem]"
					class:opacity-50={state.submittingLabel}
					disabled={state.submittingLabel}
					onclick={() => handleLabelSubmit('TRUE')}
				>
					<div
						class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90 transition-transform group-active:scale-90"
					>
						<svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<span class="text-sm font-medium transition-transform group-active:scale-95 sm:text-base"
						>TRUE</span
					>
				</button>

				<button
					class="btn btn-danger btn-md group sm:btn-lg flex min-h-[3rem] items-center justify-center space-x-2 backdrop-blur-sm sm:min-h-[3.5rem]"
					class:opacity-50={state.submittingLabel}
					disabled={state.submittingLabel}
					onclick={() => handleLabelSubmit('FALSE')}
				>
					<div
						class="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/90 transition-transform group-active:scale-90"
					>
						<svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<span class="text-sm font-medium transition-transform group-active:scale-95 sm:text-base"
						>FALSE</span
					>
				</button>
			</div>
		</div>

		<!-- Desktop layout -->
		<div class="mx-auto hidden max-w-4xl lg:block">
			<div class="mb-8 space-y-3 text-center">
				<h3 class="text-xl font-light text-gray-700">Make your decision</h3>
				<p class="mx-auto max-w-md text-sm font-light text-gray-500">
					Evaluate the content above and choose the appropriate classification
				</p>
			</div>

			<div class="mx-auto grid max-w-2xl grid-cols-2 gap-8">
				<button
					class="btn btn-success btn-label group text-center backdrop-blur-sm"
					class:opacity-50={state.submittingLabel}
					disabled={state.submittingLabel}
					onclick={() => handleLabelSubmit('TRUE')}
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/90 shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-emerald-200 group-active:scale-95"
					>
						<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<div
						class="text-xl font-medium text-emerald-700 transition-transform group-active:scale-95"
					>
						TRUE
					</div>
				</button>

				<button
					class="btn btn-danger btn-label group text-center backdrop-blur-sm"
					class:opacity-50={state.submittingLabel}
					disabled={state.submittingLabel}
					onclick={() => handleLabelSubmit('FALSE')}
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/90 shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-rose-200 group-active:scale-95"
					>
						<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<div class="text-xl font-medium text-rose-700 transition-transform group-active:scale-95">
						FALSE
					</div>
				</button>
			</div>

			<!-- Progress indicator -->
			<div class="mt-8 text-center">
				<div
					class="inline-flex items-center space-x-2 rounded-full bg-gray-100/80 px-4 py-2 text-xs text-gray-500"
				>
					<svg class="h-3 w-3 animate-pulse text-rose-400" fill="currentColor" viewBox="0 0 20 20">
						<circle cx="10" cy="10" r="3" />
					</svg>
					<span>Take your time to make an accurate decision</span>
				</div>
			</div>
		</div>

		{#if state.submittingLabel}
			<div class="mt-4 flex items-center justify-center space-x-2 text-gray-600">
				<span class="loading loading-spinner loading-sm text-rose-400"></span>
				<span class="text-sm font-light">Submitting...</span>
			</div>
		{/if}
	</div>
{/if}

<!-- Only show full interface when explicitly requested -->
{#if showFull}
	<div class="rounded-2xl border border-gray-200/50 bg-white/80 p-8 backdrop-blur-sm">
		<div class="mb-8 text-center">
			<h3 class="mb-2 text-xl font-light text-gray-700">Make your choice</h3>
			<p class="text-sm font-light text-gray-500">
				Evaluate the content and choose the appropriate classification
			</p>
		</div>

		<div class="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
			<button
				class="btn btn-success btn-label group text-center"
				class:opacity-50={state.submittingLabel}
				disabled={state.submittingLabel || !state.currentContent}
				onclick={() => handleLabelSubmit('TRUE')}
			>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 transition-transform group-hover:scale-105"
				>
					<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<div class="text-lg font-medium text-emerald-700">TRUE</div>
			</button>

			<button
				class="btn btn-danger btn-label group text-center"
				class:opacity-50={state.submittingLabel}
				disabled={state.submittingLabel || !state.currentContent}
				onclick={() => handleLabelSubmit('FALSE')}
			>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 transition-transform group-hover:scale-105"
				>
					<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>
				<div class="text-lg font-medium text-rose-700">FALSE</div>
			</button>
		</div>

		{#if state.submittingLabel}
			<div class="mt-8 flex items-center justify-center space-x-3 text-gray-600">
				<span class="loading loading-spinner loading-sm text-rose-400"></span>
				<span class="font-light">Submitting your choice...</span>
			</div>
		{/if}

		{#if !state.currentContent}
			<div
				class="mt-8 flex items-center space-x-3 rounded-2xl border border-rose-200 bg-rose-50 p-6"
			>
				<div class="h-2 w-2 flex-shrink-0 rounded-full bg-rose-400"></div>
				<span class="font-light text-rose-700">No content available to label</span>
			</div>
		{/if}
	</div>
{/if}
