<script lang="ts">
	import { onMount } from 'svelte';
	import SimpleLoader from './SimpleLoader.svelte';

	// Animation stage durations (ms) — must stay in sync with CSS animation durations below
	const STAGE_1_DURATION = 850;
	const STAGE_2_DURATION = 700;

	interface Props {
		lastDecision?: string;
	}

	let { lastDecision }: Props = $props();

	let stage = $state(1); // 1: decision recorded, 2: ballot drop, 3: new content loading
	let isTrue = $derived((lastDecision || 'TRUE') === 'TRUE');

	onMount(() => {
		const t1 = setTimeout(() => {
			stage = 2;
		}, STAGE_1_DURATION);
		const t2 = setTimeout(() => {
			stage = 3;
		}, STAGE_1_DURATION + STAGE_2_DURATION);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	});
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center space-y-12 py-32">
	{#if stage === 1}
		<!-- Stage 1: Decision Recorded -->
		<div class="flex flex-col items-center space-y-6">
			<div class="relative">
				<!-- Circle scales in cleanly — no inline opacity override -->
				<div
					class="animate-scale-in flex h-24 w-24 items-center justify-center rounded-full shadow-2xl"
					class:bg-emerald-500={isTrue}
					class:bg-rose-500={!isTrue}
				>
					{#if isTrue}
						<svg
							class="icon-animate h-16 w-16 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						<svg
							class="icon-animate h-16 w-16 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12" />
						</svg>
					{/if}
				</div>

				<!-- Ripple -->
				<div
					class="absolute inset-0 animate-ping rounded-full opacity-20"
					class:bg-emerald-200={isTrue}
					class:bg-rose-200={!isTrue}
					style="animation-delay: 0.45s; animation-duration: 1s;"
				></div>
			</div>

			<!-- Text slides up after circle lands -->
			<div class="animate-slide-up space-y-3 text-center" style="animation-delay: 0.55s;">
				<h2 class="text-4xl font-light text-gray-700">Decision Recorded</h2>
				<div
					class="inline-flex items-center space-x-2 rounded-full border-2 px-6 py-3"
					class:bg-emerald-50={isTrue}
					class:border-emerald-200={isTrue}
					class:bg-rose-50={!isTrue}
					class:border-rose-200={!isTrue}
				>
					<div
						class="text-3xl font-medium"
						class:text-emerald-700={isTrue}
						class:text-rose-700={!isTrue}
					>
						{lastDecision || 'TRUE'}
					</div>
				</div>
				<p class="mt-2 text-lg font-light text-gray-500">Thank you for your choice</p>
			</div>
		</div>
	{:else if stage === 2}
		<!-- Stage 2: Card drops into ballot box -->
		<div class="relative flex flex-col items-center">
			<!-- Decision card drops in from above -->
			<div class="animate-drop-in absolute -top-14">
				<div
					class="flex h-12 w-24 items-center justify-center rounded-lg border-2 text-lg font-medium shadow-lg"
					class:bg-emerald-100={isTrue}
					class:border-emerald-200={isTrue}
					class:text-emerald-700={isTrue}
					class:bg-rose-100={!isTrue}
					class:border-rose-200={!isTrue}
					class:text-rose-700={!isTrue}
				>
					{lastDecision || 'TRUE'}
				</div>
			</div>

			<!-- Ballot box fades in -->
			<div class="animate-fade-in mt-16">
				<svg class="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="1.5" />
					<path d="M12 2L12 6" stroke-width="2" stroke-linecap="round" />
					<path d="M8 2L16 2" stroke-width="2" stroke-linecap="round" />
					<rect x="10" y="8" width="4" height="2" rx="1" fill="currentColor" opacity="0.3" />
				</svg>
			</div>

			<div class="animate-slide-up mt-8 text-center" style="animation-delay: 0.1s;">
				<h3 class="text-2xl font-light text-gray-700">Vote Submitted</h3>
				<p class="mt-2 text-lg font-light text-gray-500">Thank you for your contribution</p>
			</div>
		</div>
	{:else}
		<!-- Stage 3: Loading next content -->
		<SimpleLoader />
	{/if}
</div>

<style>
	.icon-animate {
		opacity: 0;
		animation: fadeIn 0.3s var(--ease-out-quart, ease-out) 0.25s forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
