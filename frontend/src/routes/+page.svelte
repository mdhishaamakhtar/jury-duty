<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading, signingIn } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import GuidelinesModal from '$lib/components/GuidelinesModal.svelte';
	import BallotBoxLogo from '$lib/components/BallotBoxLogo.svelte';

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

<div class="flex min-h-screen items-center justify-center bg-rose-50 p-6">
	<div class="w-full max-w-lg space-y-10 text-center">
		<!-- Logo and Title -->
		<div class="space-y-8">
			<!-- Logo with subtle animation -->
			<div class="flex justify-center">
				<div class="transform transition-all duration-700 hover:scale-105">
					<BallotBoxLogo size={140} />
				</div>
			</div>

			<!-- Title with improved hierarchy -->
			<div class="space-y-6">
				<h1 class="text-5xl leading-tight font-light tracking-tight text-gray-800 sm:text-6xl">
					jury duty
				</h1>
				<div class="space-y-3">
					<p class="text-xl font-normal tracking-normal text-gray-600">
						Help improve AI through content labeling
					</p>
					<p class="mx-auto max-w-md text-sm leading-relaxed font-light text-gray-500">
						Join our community of reviewers to evaluate and classify content, contributing to better
						AI systems
					</p>
				</div>
			</div>
		</div>

		<!-- Feature highlights (hidden on small screens for minimalism) -->
		<div class="mx-auto hidden max-w-lg grid-cols-3 gap-6 text-center sm:grid">
			<div class="space-y-2">
				<div class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
					<svg class="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<p class="text-xs font-medium text-gray-700">Quick & Easy</p>
			</div>
			<div class="space-y-2">
				<div class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
					<svg class="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
						/>
					</svg>
				</div>
				<p class="text-xs font-medium text-gray-700">Community</p>
			</div>
			<div class="space-y-2">
				<div class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
					<svg class="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
				</div>
				<p class="text-xs font-medium text-gray-700">AI Impact</p>
			</div>
		</div>

		<!-- Action Buttons -->
		{#if $loading}
			<div class="flex justify-center py-6">
				<div class="space-y-3 text-center">
					<span class="loading loading-spinner loading-lg text-rose-400"></span>
					<p class="text-sm font-light text-gray-500">Loading your session...</p>
				</div>
			</div>
		{:else}
			<div class="space-y-5">
				<!-- Primary CTA -->
				<button
					class="btn btn-primary btn-xl btn-full group space-x-3"
					class:opacity-50={$signingIn}
					disabled={$signingIn}
					onclick={handleGoogleLogin}
				>
					{#if $signingIn}
						<span class="loading loading-spinner loading-sm text-rose-500"></span>
						<span class="text-gray-700">Signing in...</span>
					{:else}
						<svg class="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
						<span class="font-medium text-gray-700">Get Started with Google</span>
					{/if}
				</button>

				<!-- Secondary action -->
				<button
					class="btn btn-secondary btn-lg btn-full group space-x-2"
					class:opacity-50={showingGuidelines}
					disabled={showingGuidelines}
					onclick={openGuidelines}
				>
					{#if showingGuidelines}
						<span class="loading loading-spinner loading-xs text-rose-400"></span>
						<span>Opening guidelines...</span>
					{:else}
						<svg
							class="h-4 w-4 transition-transform group-hover:scale-110"
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
						<span>Preview Guidelines</span>
					{/if}
				</button>

				<!-- Subtle trust indicator -->
				<div class="flex items-center justify-center space-x-2 pt-2">
					<div class="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
					<p class="text-xs font-light text-gray-500">Secure sign-in • No personal data stored</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<GuidelinesModal open={showGuidelines} onClose={closeGuidelines} />
