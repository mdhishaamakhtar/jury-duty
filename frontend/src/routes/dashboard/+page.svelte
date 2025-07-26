<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading } from '$lib/stores/auth';
	import { contentStore } from '$lib/stores/content';
	import { goto } from '$app/navigation';
	import ContentDisplay from '$lib/components/ContentDisplay.svelte';
	import LabelingInterface from '$lib/components/LabelingInterface.svelte';

	const contentState = $derived($contentStore);

	onMount(async () => {
		// Redirect if not logged in
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
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content text-center">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	</div>
{:else if $user}
	<div class="drawer lg:drawer-open min-h-screen">
		<div class="drawer-content flex flex-col">
			<!-- Main Content -->
			<main class="flex-1 p-6">
				<div class="mx-auto max-w-4xl space-y-6">
					<!-- Error Alert -->
					{#if contentState.error}
						<div class="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{contentState.error}</span>
							<div>
								<button
									class="btn btn-sm btn-ghost"
									onclick={handleDismissError}
									aria-label="Dismiss error"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
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
								</button>
							</div>
						</div>
					{/if}

					<!-- Content States -->
					{#if contentState.loading}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<div class="hero">
									<div class="hero-content text-center">
										<div class="max-w-md">
											<span class="loading loading-spinner loading-lg text-primary"></span>
											<h3 class="mt-4 text-lg font-bold">Fetching Content</h3>
											<p class="py-2">Please wait while we load the next item to label...</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					{:else if contentState.currentContent}
						<!-- Content Display -->
						<ContentDisplay content={contentState.currentContent} />

						<!-- Labeling Interface -->
						<LabelingInterface onLabelSubmit={handleLabelSubmitted} />
					{:else}
						<!-- Empty State -->
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<div class="hero">
									<div class="hero-content text-center">
										<div class="max-w-md">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="text-base-content/30 mx-auto h-24 w-24"
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
											<h3 class="text-3xl font-bold">No Content Available</h3>
											<p class="py-6">
												Ready to start labeling? Click the button below to fetch your first content
												item.
											</p>
											<button class="btn btn-primary btn-lg" onclick={handleGetNextContent}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													class="h-6 w-6 stroke-current"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 4v16m8-8H4"
													></path>
												</svg>
												Start Labeling
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</main>
		</div>

		<!-- Sidebar -->
		<div class="drawer-side">
			<label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
			<aside class="bg-base-200 text-base-content min-h-full w-80">
				<div class="p-4">
					<div>
						<a onclick={handleSignOut} class="flex cursor-pointer items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="h-4 w-4 stroke-current"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							<span>Sign out</span>
						</a>
					</div>
				</div>
			</aside>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<h2 class="mb-4 text-2xl font-bold">Access Denied</h2>
			<p class="mb-4">Please sign in to access the dashboard.</p>
			<a href="/" class="btn btn-primary">Go to Login</a>
		</div>
	</div>
{/if}
