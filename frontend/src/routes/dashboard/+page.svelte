<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading, signingOut } from '$lib/stores/auth';
	import { contentStore } from '$lib/stores/content';
	import { goto } from '$app/navigation';
	import ContentDisplay from '$lib/components/ContentDisplay.svelte';
	import LabelingInterface from '$lib/components/LabelingInterface.svelte';
	import GuidelinesModal from '$lib/components/GuidelinesModal.svelte';
	import BallotBoxLoader from '$lib/components/BallotBoxLoader.svelte';
	import SimpleLoader from '$lib/components/SimpleLoader.svelte';
	import BallotBoxLogo from '$lib/components/BallotBoxLogo.svelte';

	const contentState = $derived($contentStore);
	let showGuidelines = $state(false);
	let showingGuidelines = $state(false);

	onMount(async () => {
		if (!$loading && !$user) {
			goto('/');
		}
	});

	// Auto-fetch content when user becomes available
	$effect(() => {
		if ($user && !contentState.currentContent && !contentState.loading) {
			contentStore.fetchNextContent();
		}
	});

	async function handleSignOut() {
		await authStore.signOut();
	}

	async function handleGetNextContent() {
		await contentStore.fetchNextContent();
	}

	function handleLabelSubmitted(label: string) {
		console.log('Label submitted:', label);
	}

	function handleDismissError() {
		contentStore.clearError();
	}

	function openGuidelines() {
		showingGuidelines = true;
		setTimeout(() => {
			showGuidelines = true;
			showingGuidelines = false;
		}, 200);
	}

	function closeGuidelines() {
		showGuidelines = false;
	}
</script>

{#if $loading}
	<div class="flex min-h-screen items-center justify-center bg-rose-50">
		<div class="space-y-4 text-center">
			<span class="loading loading-spinner loading-lg text-rose-400"></span>
			<p class="font-light text-gray-500">Loading...</p>
		</div>
	</div>
{:else if $user}
	<div class="min-h-screen bg-rose-50">
		<!-- Header -->
		<header class="border-b border-gray-200/50 bg-white/90 shadow-sm backdrop-blur-md">
			<div class="mx-auto max-w-4xl px-6 py-5">
				<div class="flex items-center justify-between">
					<!-- Left side - Logo & Title -->
					<div class="flex items-center space-x-4">
						<div class="transition-transform hover:scale-105">
							<BallotBoxLogo size={36} />
						</div>
						<div class="space-y-1">
							<h1 class="text-2xl font-light text-gray-800">jury duty</h1>
							<div class="flex items-center space-x-2 text-xs">
								<div class="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
								<span class="font-light text-gray-500">Active session</span>
							</div>
						</div>
					</div>

					<!-- Right side - Actions -->
					<div class="flex items-center space-x-2">
						<button
							class="btn btn-secondary btn-md group gap-2"
							class:opacity-50={showingGuidelines}
							disabled={showingGuidelines}
							onclick={openGuidelines}
						>
							<svg
								class="h-4 w-4 text-gray-600 transition-transform group-hover:scale-110"
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
							{#if showingGuidelines}
								<span class="loading loading-spinner loading-xs hidden text-rose-400 sm:inline"
								></span>
							{/if}
							<span class="hidden sm:inline">{showingGuidelines ? 'Opening...' : 'Guidelines'}</span
							>
						</button>
						<button
							class="btn btn-secondary btn-md group gap-2"
							class:opacity-50={$signingOut}
							disabled={$signingOut}
							onclick={handleSignOut}
						>
							<svg
								class="h-4 w-4 text-gray-600 transition-transform group-hover:scale-110"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							{#if $signingOut}
								<span class="loading loading-spinner loading-xs hidden text-rose-400 sm:inline"
								></span>
							{/if}
							<span class="hidden sm:inline">{$signingOut ? 'Signing out...' : 'Sign out'}</span>
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="mx-auto max-w-4xl px-6 py-12 pb-32">
			<!-- Enhanced Error Alert -->
			{#if contentState.error}
				<div class="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
								<svg
									class="h-5 w-5 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
						</div>
						<div class="min-w-0 flex-1">
							<h3 class="mb-1 text-sm font-medium text-red-800">Something went wrong</h3>
							<p class="mb-3 text-sm text-red-700">{contentState.error}</p>
							<div class="flex items-center space-x-3">
								<button
									class="btn btn-ghost btn-sm text-red-700 hover:bg-red-50 hover:text-red-800"
									onclick={handleGetNextContent}
								>
									Try Again
								</button>
								<button
									class="btn btn-ghost btn-sm text-red-600 hover:text-red-800"
									onclick={handleDismissError}
								>
									Dismiss
								</button>
							</div>
						</div>
						<button
							class="btn btn-icon text-red-400 hover:text-red-600"
							onclick={handleDismissError}
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/if}

			<!-- Content States -->
			{#if contentState.showingBallotLoader}
				<BallotBoxLoader lastDecision={contentState.lastDecision} />
			{:else if contentState.loading}
				<SimpleLoader />
			{:else if contentState.currentContent}
				<div class="space-y-8">
					<!-- Content Display -->
					<ContentDisplay content={contentState.currentContent} />

					<!-- Labeling Interface -->
					<LabelingInterface onLabelSubmit={handleLabelSubmitted} />
				</div>
			{:else}
				<!-- Enhanced Empty State -->
				<div class="py-20 text-center">
					<div class="mx-auto max-w-md space-y-8">
						<!-- Illustration -->
						<div class="relative">
							<div
								class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 shadow-inner"
							>
								<svg
									class="h-10 w-10 text-rose-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<!-- Floating elements -->
							<div
								class="animate-pulse-soft absolute -top-2 -right-2 h-3 w-3 rounded-full bg-rose-300"
							></div>
							<div
								class="animate-pulse-soft absolute -bottom-1 -left-3 h-2 w-2 rounded-full bg-rose-300"
								style="animation-delay: 0.5s;"
							></div>
						</div>

						<!-- Content -->
						<div class="space-y-6">
							<div class="space-y-3">
								<h3 class="text-2xl font-light text-gray-700">Ready to get started?</h3>
								<p class="leading-relaxed font-light text-gray-500">
									You're all set! Click the button below to fetch your first content item and begin
									labeling.
								</p>
							</div>

							<!-- Stats preview -->
							<div class="grid grid-cols-3 gap-6 border-t border-b border-gray-100 py-6">
								<div class="space-y-1 text-center">
									<div
										class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100"
									>
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
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<p class="text-xs font-medium text-gray-700">Quick Review</p>
									<p class="text-xs text-gray-500">~30s per item</p>
								</div>
								<div class="space-y-1 text-center">
									<div
										class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100"
									>
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
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<p class="text-xs font-medium text-gray-700">Accurate Labels</p>
									<p class="text-xs text-gray-500">Quality focus</p>
								</div>
								<div class="space-y-1 text-center">
									<div
										class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100"
									>
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
												d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
											/>
										</svg>
									</div>
									<p class="text-xs font-medium text-gray-700">AI Impact</p>
									<p class="text-xs text-gray-500">Meaningful work</p>
								</div>
							</div>

							<!-- CTA -->
							<button class="btn btn-primary btn-xl group" onclick={handleGetNextContent}>
								<svg
									class="mr-3 h-5 w-5 transition-transform group-hover:scale-110"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
								Start Labeling
							</button>

							<!-- Help text -->
							<div class="flex items-center justify-center space-x-2 text-xs text-gray-400">
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Need help? Check the guidelines first</span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</main>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-rose-50 p-6">
		<div class="space-y-6 text-center">
			<h2 class="text-2xl font-light text-gray-700">Access denied</h2>
			<p class="font-light text-gray-500">Please sign in to access the dashboard</p>
			<a href="/" class="btn btn-primary btn-lg"> Go to Login </a>
		</div>
	</div>
{/if}

<GuidelinesModal open={showGuidelines} onClose={closeGuidelines} />
