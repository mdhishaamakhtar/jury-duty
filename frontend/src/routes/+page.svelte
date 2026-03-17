<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading, signingIn } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import GuidelinesModal from '$lib/components/GuidelinesModal.svelte';
	import BallotBoxLogo from '$lib/components/BallotBoxLogo.svelte';

	let showGuidelines = $state(false);

	onMount(async () => {
		if ($user) {
			goto('/dashboard');
		}
	});

	async function handleGoogleLogin() {
		await authStore.signInWithGoogle();
	}

	function openGuidelines() {
		showGuidelines = true;
	}

	function closeGuidelines() {
		showGuidelines = false;
	}
</script>

<div class="flex min-h-screen flex-col bg-stone-50">
	<!-- Institutional top stripe -->
	<div class="h-1 bg-rose-600"></div>

	<div class="flex flex-1 items-center justify-center p-6">
		<div class="w-full max-w-sm space-y-10 text-center">
			<!-- Logo + Wordmark -->
			<div class="animate-fade-up space-y-4" style="animation-delay: 0ms;">
				<div class="flex justify-center" style="transition: transform 600ms var(--ease-out-quint);">
					<div class="hover:scale-105">
						<BallotBoxLogo size={72} />
					</div>
				</div>
				<div>
					<h1 class="wordmark text-5xl text-stone-900">jury duty</h1>
					<p class="mt-2 text-xs font-medium tracking-widest text-rose-600 uppercase">
						Content Labeling System
					</p>
				</div>
			</div>

			<!-- Tagline -->
			<div class="animate-fade-up" style="animation-delay: 80ms;">
				<p class="text-base text-stone-500">Help improve AI through content labeling</p>
			</div>

			<!-- Actions -->
			{#if $loading}
				<div class="flex justify-center py-4">
					<span class="loading loading-spinner loading-lg text-rose-500"></span>
				</div>
			{:else}
				<div class="animate-fade-up space-y-3" style="animation-delay: 160ms;">
					<button
						class="btn btn-primary btn-xl btn-full group space-x-3"
						class:opacity-60={$signingIn}
						disabled={$signingIn}
						onclick={handleGoogleLogin}
					>
						{#if $signingIn}
							<span class="loading loading-spinner loading-sm text-white/80"></span>
							<span>Signing in...</span>
						{:else}
							<svg class="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
								<path
									fill="rgba(255,255,255,0.9)"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="rgba(255,255,255,0.9)"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="rgba(255,255,255,0.9)"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="rgba(255,255,255,0.9)"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							<span class="font-medium">Continue with Google</span>
						{/if}
					</button>

					<button
						class="btn btn-secondary btn-lg btn-full group space-x-2"
						onclick={openGuidelines}
					>
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
					</button>

					<p class="pt-1 text-xs font-light text-stone-400">
						Secure sign-in · No personal data stored
					</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Institutional footer rule -->
	<div class="border-t border-stone-200 py-4 text-center">
		<p class="text-xs text-stone-400">Confidential · Internal Use Only</p>
	</div>
</div>

<GuidelinesModal open={showGuidelines} onClose={closeGuidelines} />
