<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading, signingIn } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import GuidelinesModal from '$lib/components/GuidelinesModal.svelte';

	let showGuidelines = $state(false);
	let showingGuidelines = $state(false);

	onMount(async () => {
		if ($user) {
			goto('/dashboard');
		}
	});

	async function handleGoogleLogin() {
		await authStore.signInWithGoogle();
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

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-6"
>
	<div class="w-full max-w-md space-y-8 text-center">
		<!-- Title -->
		<div class="space-y-4">
			<h1 class="text-6xl font-light tracking-tight text-gray-800">jury duty</h1>
			<p class="text-lg font-light text-gray-500">Help improve AI through content labeling</p>
		</div>

		<!-- Login Button -->
		{#if $loading}
			<div class="flex justify-center py-4">
				<span class="loading loading-spinner loading-lg text-rose-400"></span>
			</div>
		{:else}
			<div class="space-y-4">
				<button
					class="btn btn-ghost inline-flex w-full items-center justify-center space-x-3 rounded-full border-gray-200 bg-white/80 px-8 py-3 text-lg font-normal text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-white active:scale-95 disabled:cursor-not-allowed"
					class:opacity-50={$signingIn}
					disabled={$signingIn}
					onclick={handleGoogleLogin}
				>
					{#if $signingIn}
						<span class="loading loading-spinner loading-sm text-rose-400"></span>
						<span>Signing in...</span>
					{:else}
						<svg class="h-5 w-5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC04"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span>Sign in with Google</span>
					{/if}
				</button>

				<!-- Guidelines Button -->
				<button
					class="inline-flex w-full items-center justify-center space-x-2 rounded-full border border-transparent px-6 py-2 text-sm font-light text-gray-600 transition-all duration-200 hover:border-gray-200 hover:bg-white/80 hover:text-gray-800 active:scale-95 disabled:cursor-not-allowed"
					class:opacity-50={showingGuidelines}
					disabled={showingGuidelines}
					onclick={openGuidelines}
				>
					{#if showingGuidelines}
						<span class="loading loading-spinner loading-xs text-rose-400"></span>
						<span>Opening guidelines...</span>
					{:else}
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span>View labeling guidelines</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

<GuidelinesModal open={showGuidelines} onClose={closeGuidelines} />
