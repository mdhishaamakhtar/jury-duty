<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading } from '$lib/stores/auth';
	import { contentStore } from '$lib/stores/content';
	import { goto } from '$app/navigation';
	import ContentDisplay from '$lib/components/ContentDisplay.svelte';
	import LabelingInterface from '$lib/components/LabelingInterface.svelte';

	const contentState = $derived($contentStore);

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
</script>

{#if $loading}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50"
	>
		<div class="space-y-4 text-center">
			<span class="loading loading-spinner loading-lg text-rose-400"></span>
			<p class="font-light text-gray-500">Loading...</p>
		</div>
	</div>
{:else if $user}
	<div class="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
		<!-- Header -->
		<header class="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
			<div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
				<h1 class="text-2xl font-light text-gray-800">jury duty</h1>
				<button
					class="btn btn-ghost btn-sm rounded-full px-4 font-light text-gray-600 hover:text-gray-800"
					onclick={handleSignOut}
				>
					Sign out
				</button>
			</div>
		</header>

		<!-- Main Content -->
		<main class="mx-auto max-w-4xl px-6 py-12 pb-32">
			<!-- Error Alert -->
			{#if contentState.error}
				<div
					class="mb-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-6"
				>
					<div class="flex items-center space-x-3">
						<div class="h-2 w-2 rounded-full bg-red-400"></div>
						<span class="font-light text-red-700">{contentState.error}</span>
					</div>
					<button
						class="text-red-400 transition-colors hover:text-red-600"
						onclick={handleDismissError}
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
			{/if}

			<!-- Content States -->
			{#if contentState.loading}
				<div class="py-20 text-center">
					<span class="loading loading-spinner loading-lg text-rose-400"></span>
					<h3 class="mt-6 text-xl font-light text-gray-700">Loading content...</h3>
					<p class="mt-2 font-light text-gray-500">Please wait while we fetch the next item</p>
				</div>
			{:else if contentState.currentContent}
				<div class="space-y-8">
					<!-- Content Display -->
					<ContentDisplay content={contentState.currentContent} />

					<!-- Labeling Interface -->
					<LabelingInterface onLabelSubmit={handleLabelSubmitted} />
				</div>
			{:else}
				<!-- Empty State -->
				<div class="py-20 text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
					>
						<svg
							class="h-8 w-8 text-gray-400"
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
					<h3 class="mb-4 text-2xl font-light text-gray-700">No content available</h3>
					<p class="mx-auto mb-8 max-w-md font-light text-gray-500">
						Ready to start labeling? Click below to fetch your first content item.
					</p>
					<button
						class="btn rounded-full border-gray-200 bg-white/80 px-8 py-3 font-light text-gray-700 transition-all duration-200 hover:bg-white"
						onclick={handleGetNextContent}
					>
						Start Labeling
					</button>
				</div>
			{/if}
		</main>
	</div>
{:else}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-6"
	>
		<div class="space-y-6 text-center">
			<h2 class="text-2xl font-light text-gray-700">Access denied</h2>
			<p class="font-light text-gray-500">Please sign in to access the dashboard</p>
			<a
				href="/"
				class="btn rounded-full border-gray-200 bg-white/80 px-8 py-3 font-light text-gray-700 hover:bg-white"
			>
				Go to Login
			</a>
		</div>
	</div>
{/if}
