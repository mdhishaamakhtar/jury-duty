<script lang="ts">
	import { onMount } from 'svelte';
	import SimpleLoader from './SimpleLoader.svelte';

	// All Stage 1 animations complete by ~580ms; STAGE_1_DURATION gives reading time before fade
	const STAGE_1_DURATION = 1050;
	// Ballot box visible at ~250ms, card lands at ~700ms; STAGE_2_DURATION gives pause after
	const STAGE_2_DURATION = 900;
	// Duration of the opacity crossfade between stages
	const FADE_MS = 150;

	interface Props {
		lastDecision?: string;
	}

	let { lastDecision }: Props = $props();

	let displayedStage = $state(1);
	let stageVisible = $state(true);
	let isTrue = $derived((lastDecision || 'TRUE') === 'TRUE');

	function goToStage(n: number) {
		stageVisible = false;
		setTimeout(() => {
			displayedStage = n;
			stageVisible = true;
		}, FADE_MS + 20);
	}

	onMount(() => {
		const t1 = setTimeout(() => goToStage(2), STAGE_1_DURATION);
		const t2 = setTimeout(() => goToStage(3), STAGE_1_DURATION + STAGE_2_DURATION);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	});
</script>

<!--
  Outer div fades opacity to 0, swaps content, fades back to 1.
  This gives a clean crossfade between stages without layout shift.
-->
<div
	class="flex min-h-[60vh] flex-col items-center justify-center py-32"
	style="transition: opacity {FADE_MS}ms var(--ease-out-quart); opacity: {stageVisible ? 1 : 0};"
>
	{#if displayedStage === 1}
		<!-- Stage 1: Verdict — circle + icon + label, all timed to complete by ~580ms -->
		<div class="flex flex-col items-center space-y-6">
			<div class="relative">
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

				<!-- Ripple — starts after circle lands (~350ms) -->
				<div
					class="absolute inset-0 animate-ping rounded-full opacity-20"
					class:bg-emerald-200={isTrue}
					class:bg-rose-200={!isTrue}
					style="animation-delay: 0.35s; animation-duration: 1s;"
				></div>
			</div>

			<!--
				Text: delay 0.22s (was 0.55s) so slide-up completes at ~580ms.
				Previous 0.55s delay caused text to finish at ~1000ms — past the stage switch.
			-->
			<div class="animate-slide-up space-y-3 text-center" style="animation-delay: 0.22s;">
				<h2 class="text-4xl font-light text-stone-700">Decision Recorded</h2>
				<div
					class="inline-flex items-center rounded-full border px-6 py-3"
					class:bg-emerald-50={isTrue}
					class:border-emerald-300={isTrue}
					class:bg-rose-50={!isTrue}
					class:border-rose-300={!isTrue}
				>
					<div
						class="text-3xl font-medium"
						class:text-emerald-700={isTrue}
						class:text-rose-700={!isTrue}
					>
						{lastDecision || 'TRUE'}
					</div>
				</div>
			</div>
		</div>
	{:else if displayedStage === 2}
		<!--
			Stage 2: Ballot drop.
			Ballot box fades in first (0ms) — the destination is visible before the card arrives.
			Card drops after 200ms delay — you see where it's going before it falls.
			Card positioned to land with its bottom edge in the ballot slot (~slot at y≈20% of SVG).
			No redundant "Vote Submitted" text — the visual tells the story.
		-->
		<div class="relative flex items-start justify-center">
			<!-- Ballot box: appears immediately when stage starts -->
			<div class="animate-fade-in mt-16">
				<svg class="h-32 w-32 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="1.5" />
					<path d="M12 2L12 6" stroke-width="2" stroke-linecap="round" />
					<path d="M8 2L16 2" stroke-width="2" stroke-linecap="round" />
					<rect x="10" y="8" width="4" height="2" rx="1" fill="currentColor" opacity="0.3" />
				</svg>
			</div>

			<!--
				Card: absolute, centered, drops after 200ms.
				top: 26px → card bottom lands at ~70px from container = inside the ballot box slot.
				fill-mode: both means it waits invisible at translateY(-56px) during the delay.
			-->
			<div
				class="animate-drop-in absolute left-1/2 -translate-x-1/2"
				style="top: 26px; animation-delay: 0.2s;"
			>
				<div
					class="flex h-11 w-24 items-center justify-center rounded-lg border text-base font-semibold shadow-md"
					class:bg-emerald-50={isTrue}
					class:border-emerald-300={isTrue}
					class:text-emerald-700={isTrue}
					class:bg-rose-50={!isTrue}
					class:border-rose-300={!isTrue}
					class:text-rose-700={!isTrue}
				>
					{lastDecision || 'TRUE'}
				</div>
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
		/* Tightened from 0.25s delay to 0.18s — icon appears while circle is still settling */
		animation: fadeIn 0.22s var(--ease-out-quart, ease-out) 0.18s forwards;
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
