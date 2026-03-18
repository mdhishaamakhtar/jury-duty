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
	import MobileProgressPanel from '$lib/components/MobileProgressPanel.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	const contentState = $derived($contentStore);
	let showGuidelines = $state(false);
	let showMobileProgress = $state(false);
	let showGuidelinesLabel = $state(false);

	onMount(async () => {
		if (!$loading && !$user) {
			goto('/');
		}
		// Smart Guidelines: show label for first 3 sessions, then icon-only
		const visits = parseInt(localStorage.getItem('jd_visits') || '0') + 1;
		localStorage.setItem('jd_visits', String(visits));
		showGuidelinesLabel = visits <= 3;
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

	function handleDismissError() {
		contentStore.clearError();
	}

	function openGuidelines() {
		showGuidelines = true;
	}

	function closeGuidelines() {
		showGuidelines = false;
	}

	function toggleMobileProgress() {
		showMobileProgress = !showMobileProgress;
	}
</script>

{#if $loading}
	<div class="flex min-h-screen items-center justify-center bg-stone-50">
		<div class="space-y-4 text-center">
			<span class="loading loading-spinner loading-lg text-rose-400"></span>
			<p class="font-light text-gray-500">Loading...</p>
		</div>
	</div>
{:else if $user}
	<div class="min-h-screen bg-stone-50">
		<!-- Header -->
		<header class="border-b border-gray-200/50 bg-white/90 shadow-sm backdrop-blur-md">
			<div class="mx-auto max-w-4xl px-6 py-4 sm:py-5">
				<!-- Single row header with everything -->
				<div class="flex min-h-[2.5rem] items-center justify-between gap-2">
					<!-- Left: Logo + Title + Progress -->
					<div class="flex min-w-0 flex-1 items-center gap-3">
						<!-- Logo + Title -->
						<div class="flex items-center gap-2.5">
							<div class="flex-shrink-0 transition-transform hover:scale-105">
								<BallotBoxLogo size={28} />
							</div>
							<h1 class="wordmark text-xl text-stone-900">jury duty</h1>
						</div>

						<!-- Progress - only show on wider screens when we have content -->
						{#if contentState.currentContent}
							{@const totalCount =
								contentState.currentContent.labeled_count +
								contentState.currentContent.remaining_count}
							{@const progressPercent =
								totalCount > 0 ? (contentState.currentContent.labeled_count / totalCount) * 100 : 0}
							<div class="hidden items-center gap-3 text-xs sm:flex">
								<div class="h-3 w-px bg-gray-200"></div>
								<div class="flex items-center gap-2">
									<!-- Progress bar -->
									<div class="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
										<div
											class="h-full bg-emerald-400 transition-all duration-300"
											style="width: {progressPercent}%"
										></div>
									</div>
									<!-- Fraction + Percentage -->
									<span class="font-mono-progress text-sm font-medium text-gray-600">
										{contentState.currentContent.labeled_count}/{totalCount} ({Math.round(
											progressPercent
										)}%)
									</span>
								</div>
							</div>
						{/if}
					</div>

					<!-- Right: Action buttons -->
					<div class="flex flex-shrink-0 items-center gap-1.5">
						<!-- Progress button - always show on mobile, disable when no content -->
						<button
							class="btn btn-secondary btn-md group gap-2 focus:ring-0 focus:ring-offset-0 focus:outline-none sm:hidden"
							class:bg-emerald-50={showMobileProgress && contentState.currentContent}
							class:border-emerald-200={showMobileProgress && contentState.currentContent}
							class:text-emerald-700={showMobileProgress && contentState.currentContent}
							disabled={!contentState.currentContent}
							onclick={toggleMobileProgress}
							aria-label="View Progress"
						>
							<svg
								class="h-4 w-4 transition-transform group-hover:scale-110"
								class:text-gray-600={contentState.currentContent}
								class:text-gray-400={!contentState.currentContent}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
								/>
							</svg>
						</button>

						<!-- Guidelines button: label shown for first 3 sessions, then icon-only -->
						<button class="btn btn-secondary btn-md group gap-2" onclick={openGuidelines}>
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
							{#if showGuidelinesLabel}
								<span class="hidden sm:inline">Guidelines</span>
							{/if}
						</button>

						<!-- Sign out button -->
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

		<!-- Mobile Progress Panel -->
		{#if contentState.currentContent}
			<MobileProgressPanel
				labeledCount={contentState.currentContent.labeled_count}
				remainingCount={contentState.currentContent.remaining_count}
				open={showMobileProgress}
			/>
		{/if}

		<!-- Main Content -->
		<main class="mx-auto max-w-4xl px-6 py-12 pb-32">
			<!-- Enhanced Error Alert -->
			{#if contentState.error}
				<div
					class="animate-slide-down mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm"
				>
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
								<svg
									class="h-5 w-5 text-rose-600"
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
							<h3 class="mb-1 text-sm font-medium text-rose-800">Something went wrong</h3>
							<p class="mb-3 text-sm text-rose-700">{contentState.error}</p>
							<div class="flex items-center space-x-3">
								<button
									class="btn btn-ghost btn-sm text-rose-700 hover:bg-rose-50 hover:text-rose-800"
									onclick={handleGetNextContent}
								>
									Try Again
								</button>
								<button
									class="btn btn-ghost btn-sm text-rose-600 hover:text-rose-800"
									onclick={handleDismissError}
								>
									Dismiss
								</button>
							</div>
						</div>
						<button
							class="btn btn-icon text-rose-400 hover:text-rose-600"
							aria-label="Dismiss error"
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
				<BallotBoxLoader lastDecision={contentState.lastDecision ?? undefined} />
			{:else if contentState.loading}
				<SimpleLoader />
			{:else if contentState.currentContent}
				{#key contentState.currentContent.id}
					<div class="space-y-8">
						<ContentDisplay content={contentState.currentContent} />
						<LabelingInterface />
					</div>
				{/key}
			{:else}
				<EmptyState onStart={handleGetNextContent} />
			{/if}
		</main>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-stone-50 p-6">
		<div class="space-y-6 text-center">
			<h2 class="text-2xl font-light text-gray-700">Access denied</h2>
			<p class="font-light text-gray-500">Please sign in to access the dashboard</p>
			<a href="/" class="btn btn-primary btn-lg"> Go to Login </a>
		</div>
	</div>
{/if}

<GuidelinesModal open={showGuidelines} onClose={closeGuidelines} />
