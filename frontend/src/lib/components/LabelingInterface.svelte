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
	<!-- Mobile: stick to bottom, Desktop: always show inline -->
	<div
		class="
		{needsScroll ? 'fixed right-0 bottom-0 left-0 z-50 md:relative md:mt-8' : 'relative'} 
		border-t border-gray-200/50 bg-white/95 backdrop-blur-md
		{needsScroll
			? 'p-4 md:rounded-2xl md:border md:p-6 md:shadow-none'
			: 'mt-8 rounded-2xl border border-gray-200/50 p-6'}
		{needsScroll ? 'shadow-2xl shadow-black/5 md:shadow-none' : ''}
	"
	>
		<!-- Mobile layout -->
		<div class="mx-auto block grid max-w-md grid-cols-2 gap-3 md:hidden">
			<button
				class="group flex items-center justify-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-6 py-3 text-emerald-700 backdrop-blur-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100/80 active:scale-95 active:bg-emerald-200/80 disabled:cursor-not-allowed disabled:opacity-50"
				class:opacity-50={state.submittingLabel}
				disabled={state.submittingLabel}
				onclick={() => handleLabelSubmit('TRUE')}
			>
				<svg
					class="h-5 w-5 transition-transform group-active:scale-90"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				<span class="text-lg font-medium transition-transform group-active:scale-95">TRUE</span>
			</button>

			<button
				class="group flex items-center justify-center space-x-2 rounded-full border border-rose-200 bg-rose-50/80 px-6 py-3 text-rose-700 backdrop-blur-sm transition-all duration-200 hover:border-rose-300 hover:bg-rose-100/80 active:scale-95 active:bg-rose-200/80 disabled:cursor-not-allowed disabled:opacity-50"
				class:opacity-50={state.submittingLabel}
				disabled={state.submittingLabel}
				onclick={() => handleLabelSubmit('FALSE')}
			>
				<svg
					class="h-5 w-5 transition-transform group-active:scale-90"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
				<span class="text-lg font-medium transition-transform group-active:scale-95">FALSE</span>
			</button>
		</div>

		<!-- Desktop layout -->
		<div class="mx-auto hidden max-w-4xl md:block">
			<div class="mb-6 text-center">
				<h3 class="mb-1 text-lg font-light text-gray-700">Make your choice</h3>
				<p class="text-sm font-light text-gray-500">Use keyboard shortcuts or click the buttons</p>
			</div>

			<div class="mx-auto grid max-w-2xl grid-cols-2 gap-6">
				<button
					class="group rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center backdrop-blur-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100/80 active:scale-95 active:bg-emerald-200/80 disabled:cursor-not-allowed disabled:opacity-50"
					class:opacity-50={state.submittingLabel}
					disabled={state.submittingLabel}
					onclick={() => handleLabelSubmit('TRUE')}
				>
					<div
						class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/80 transition-transform group-hover:scale-105 group-active:scale-95"
					>
						<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<div
						class="mb-2 text-lg font-medium text-emerald-700 transition-transform group-active:scale-95"
					>
						TRUE
					</div>
					<div class="text-sm font-light text-emerald-600">
						Press <span class="rounded bg-emerald-100 px-2 py-1 text-xs font-medium">1</span>,
						<span class="rounded bg-emerald-100 px-2 py-1 text-xs font-medium">←</span>, or
						<span class="rounded bg-emerald-100 px-2 py-1 text-xs font-medium">T</span>
					</div>
				</button>

				<button
					class="group rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center backdrop-blur-sm transition-all duration-200 hover:border-rose-300 hover:bg-rose-100/80 active:scale-95 active:bg-rose-200/80 disabled:cursor-not-allowed disabled:opacity-50"
					class:opacity-50={state.submittingLabel}
					disabled={state.submittingLabel}
					onclick={() => handleLabelSubmit('FALSE')}
				>
					<div
						class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/80 transition-transform group-hover:scale-105 group-active:scale-95"
					>
						<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<div
						class="mb-2 text-lg font-medium text-rose-700 transition-transform group-active:scale-95"
					>
						FALSE
					</div>
					<div class="text-sm font-light text-rose-600">
						Press <span class="rounded bg-rose-100 px-2 py-1 text-xs font-medium">2</span>,
						<span class="rounded bg-rose-100 px-2 py-1 text-xs font-medium">→</span>, or
						<span class="rounded bg-rose-100 px-2 py-1 text-xs font-medium">F</span>
					</div>
				</button>
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
			<p class="text-sm font-light text-gray-500">Use keyboard shortcuts or click the buttons</p>
		</div>

		<div class="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
			<button
				class="group rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
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
				<div class="mb-2 text-lg font-medium text-emerald-700">TRUE</div>
				<div class="text-sm font-light text-emerald-600">
					Press <span class="rounded bg-emerald-100 px-2 py-1 text-xs font-medium">1</span>,
					<span class="rounded bg-emerald-100 px-2 py-1 text-xs font-medium">←</span>, or
					<span class="rounded bg-emerald-100 px-2 py-1 text-xs font-medium">T</span>
				</div>
			</button>

			<button
				class="group rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center transition-all duration-200 hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
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
				<div class="mb-2 text-lg font-medium text-rose-700">FALSE</div>
				<div class="text-sm font-light text-rose-600">
					Press <span class="rounded bg-rose-100 px-2 py-1 text-xs font-medium">2</span>,
					<span class="rounded bg-rose-100 px-2 py-1 text-xs font-medium">→</span>, or
					<span class="rounded bg-rose-100 px-2 py-1 text-xs font-medium">F</span>
				</div>
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
				class="mt-8 flex items-center space-x-3 rounded-2xl border border-amber-200 bg-amber-50 p-6"
			>
				<div class="h-2 w-2 flex-shrink-0 rounded-full bg-amber-400"></div>
				<span class="font-light text-amber-700">No content available to label</span>
			</div>
		{/if}
	</div>
{/if}
