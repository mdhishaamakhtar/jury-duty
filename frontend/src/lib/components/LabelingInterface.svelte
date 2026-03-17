<script lang="ts">
	import { contentStore } from '$lib/stores/content';
	import { onMount, tick } from 'svelte';

	let { onLabelSubmit }: { onLabelSubmit?: (label: string) => void } = $props();

	const contentState = $derived($contentStore);
	let needsScroll = $state(false);

	// Re-check after DOM settles whenever content changes
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		contentState.currentContent;
		tick().then(() => {
			needsScroll = document.documentElement.scrollHeight > window.innerHeight;
		});
	});

	onMount(() => {
		const checkScroll = () => {
			needsScroll = document.documentElement.scrollHeight > window.innerHeight;
		};

		window.addEventListener('resize', checkScroll);
		return () => window.removeEventListener('resize', checkScroll);
	});

	async function handleLabelSubmit(label: string) {
		await contentStore.submitLabel(label);
		onLabelSubmit?.(label);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (contentState.submittingLabel) return;

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

{#if contentState.currentContent}
	<div
		class="
		{needsScroll ? 'fixed right-0 bottom-0 left-0 z-50 lg:relative lg:mt-8' : 'relative'}
		border-t border-gray-200/50 bg-white/95 backdrop-blur-md
		{needsScroll
			? 'p-4 sm:p-5 lg:rounded-2xl lg:border lg:p-6 lg:shadow-sm'
			: 'mt-8 rounded-2xl border border-gray-200/50 p-6 shadow-sm'}
	"
	>
		<!-- Mobile/Tablet layout -->
		<div class="mx-auto block lg:hidden">
			<div class="mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-4">
				<button
					class="btn btn-success btn-md group sm:btn-lg flex min-h-[3rem] items-center justify-center space-x-2 sm:min-h-[3.5rem]"
					class:opacity-50={contentState.submittingLabel}
					disabled={contentState.submittingLabel}
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
					class="btn btn-danger btn-md group sm:btn-lg flex min-h-[3rem] items-center justify-center space-x-2 sm:min-h-[3.5rem]"
					class:opacity-50={contentState.submittingLabel}
					disabled={contentState.submittingLabel}
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
			<div class="mx-auto grid max-w-2xl grid-cols-2 gap-8">
				<button
					class="btn btn-success btn-label group text-center"
					class:opacity-50={contentState.submittingLabel}
					disabled={contentState.submittingLabel}
					onclick={() => handleLabelSubmit('TRUE')}
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/90 shadow-lg transition-[transform,box-shadow] duration-200 group-hover:scale-110 group-hover:shadow-emerald-200 group-active:scale-95"
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
					class="btn btn-danger btn-label group text-center"
					class:opacity-50={contentState.submittingLabel}
					disabled={contentState.submittingLabel}
					onclick={() => handleLabelSubmit('FALSE')}
				>
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/90 shadow-lg transition-[transform,box-shadow] duration-200 group-hover:scale-110 group-hover:shadow-rose-200 group-active:scale-95"
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
		</div>

		{#if contentState.submittingLabel}
			<div class="mt-4 flex items-center justify-center space-x-2 text-gray-600">
				<span class="loading loading-spinner loading-sm text-rose-400"></span>
				<span class="text-sm font-light">Submitting...</span>
			</div>
		{/if}
	</div>
{/if}
