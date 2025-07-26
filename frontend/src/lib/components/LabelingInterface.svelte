<script lang="ts">
	import { contentStore } from '$lib/stores/content';

	let { onLabelSubmit }: { onLabelSubmit?: (label: string) => void } = $props();

	const state = $derived($contentStore);

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

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h3 class="card-title mb-4 flex items-center gap-2 text-lg">
			<svg class="text-secondary h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Choose Label
		</h3>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<button
				class="btn btn-outline btn-lg hover:btn-success h-auto flex-col gap-3 p-6"
				class:loading={state.submittingLabel}
				disabled={state.submittingLabel || !state.currentContent}
				onclick={() => handleLabelSubmit('TRUE')}
			>
				<div class="flex items-center gap-2">
					<div
						class="bg-success text-success-content flex h-8 w-8 items-center justify-center rounded-full font-bold"
					>
						✓
					</div>
					<span class="text-lg font-semibold">TRUE</span>
				</div>
				<div class="text-sm opacity-70">
					Press <kbd class="kbd kbd-sm">1</kbd>, <kbd class="kbd kbd-sm">←</kbd>, or
					<kbd class="kbd kbd-sm">T</kbd>
				</div>
			</button>

			<button
				class="btn btn-outline btn-lg hover:btn-error h-auto flex-col gap-3 p-6"
				class:loading={state.submittingLabel}
				disabled={state.submittingLabel || !state.currentContent}
				onclick={() => handleLabelSubmit('FALSE')}
			>
				<div class="flex items-center gap-2">
					<div
						class="bg-error text-error-content flex h-8 w-8 items-center justify-center rounded-full font-bold"
					>
						✗
					</div>
					<span class="text-lg font-semibold">FALSE</span>
				</div>
				<div class="text-sm opacity-70">
					Press <kbd class="kbd kbd-sm">2</kbd>, <kbd class="kbd kbd-sm">→</kbd>, or
					<kbd class="kbd kbd-sm">F</kbd>
				</div>
			</button>
		</div>

		{#if state.submittingLabel}
			<div class="mt-4">
				<div class="alert alert-info">
					<div class="loading loading-spinner loading-sm"></div>
					<span>Submitting your label...</span>
				</div>
			</div>
		{/if}

		{#if !state.currentContent}
			<div class="mt-4">
				<div class="alert alert-warning">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="h-6 w-6 shrink-0 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						></path>
					</svg>
					<span>No content available to label. Please fetch content first.</span>
				</div>
			</div>
		{/if}
	</div>
</div>
