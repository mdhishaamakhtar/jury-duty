<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		lastDecision?: string;
	}

	let { lastDecision }: Props = $props();

	let stage = $state(1); // 1: decision recorded, 2: ballot drop, 3: new content loading
	let isTrue = $derived((lastDecision || 'TRUE') === 'TRUE');
	let decisionColor = $derived(isTrue ? 'emerald' : 'rose');

	onMount(() => {
		// Stage 1: Show decision recorded (0.8s)
		setTimeout(() => {
			stage = 2;
		}, 800);

		// Stage 2: Ballot drop animation (0.7s)
		setTimeout(() => {
			stage = 3;
		}, 1500);
	});
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center space-y-12 py-32">
	{#if stage === 1}
		<!-- Stage 1: Decision Recorded with Dynamic Animation -->
		<div class="flex flex-col items-center space-y-6">
			<!-- Large Animated Checkmark -->
			<div class="relative">
				<!-- Background Circle - scales in with reduced opacity -->
				<div
					class="flex h-24 w-24 items-center justify-center rounded-full shadow-2xl"
					class:bg-emerald-500={isTrue}
					class:bg-rose-500={!isTrue}
					style="animation: scaleIn 0.4s ease-out forwards; opacity: 0.8;"
				>
					<!-- Animated Icon -->
					{#if isTrue}
						<!-- Checkmark for TRUE -->
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
						<!-- X mark for FALSE -->
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

				<!-- Ripple Effect -->
				<div
					class="absolute inset-0 animate-ping rounded-full opacity-20"
					class:bg-emerald-200={isTrue}
					class:bg-rose-200={!isTrue}
					style="animation-delay: 0.5s; animation-duration: 1s;"
				></div>
			</div>

			<!-- Text Content with Slide Up Animation -->
			<div class="space-y-3 text-center" style="animation: slideUp 0.5s ease-out 0.6s both;">
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
		<!-- Stage 2: Ballot Box with Drop Animation -->
		<div class="relative flex flex-col items-center">
			<!-- Decision Card Dropping -->
			<div class="absolute -top-16 animate-bounce">
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

			<!-- Ballot Box -->
			<div class="mt-16">
				<svg class="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke-width="1.5" />
					<path d="M12 2L12 6" stroke-width="2" stroke-linecap="round" />
					<path d="M8 2L16 2" stroke-width="2" stroke-linecap="round" />
					<rect x="10" y="8" width="4" height="2" rx="1" fill="currentColor" opacity="0.3" />
				</svg>
			</div>

			<h3 class="mt-8 text-2xl font-light text-gray-700">Vote Submitted</h3>
			<p class="mt-2 text-lg font-light text-gray-500">Thank you for your contribution</p>
		</div>
	{:else}
		<!-- Stage 3: New Content Loading -->
		<div class="flex flex-col items-center space-y-8">
			<!-- Loading Animation -->
			<div class="relative">
				<div
					class="h-24 w-24 animate-spin rounded-full border-8 border-gray-200 border-t-rose-400"
				></div>
				<div class="absolute inset-0 flex items-center justify-center">
					<svg
						class="h-12 w-12 text-rose-400"
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
			</div>

			<div class="text-center">
				<h3 class="mb-4 text-3xl font-light text-gray-700">Fetching Next Content</h3>
				<p class="text-xl font-light text-gray-500">Preparing your next labeling task</p>
			</div>

			<!-- Loading dots -->
			<div class="flex space-x-3">
				<div class="h-4 w-4 animate-pulse rounded-full bg-rose-400"></div>
				<div
					class="h-4 w-4 animate-pulse rounded-full bg-rose-400"
					style="animation-delay: 0.2s;"
				></div>
				<div
					class="h-4 w-4 animate-pulse rounded-full bg-rose-400"
					style="animation-delay: 0.4s;"
				></div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes scaleIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes drawCheck {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.icon-animate {
		opacity: 0;
		animation: fadeIn 0.3s ease-out 0.2s forwards;
	}
</style>
