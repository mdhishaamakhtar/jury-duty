<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, user, loading } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	onMount(async () => {
		// Note: authStore.initialize() is called in +layout.svelte with server data
		// We don't need to call it again here

		// Redirect if already logged in
		if ($user) {
			goto('/dashboard');
		}
	});

	async function handleGoogleLogin() {
		await authStore.signInWithGoogle();
	}
</script>

<div class="bg-base-200 min-h-screen">
	<!-- Header -->
	<div class="navbar bg-base-100/80 shadow-sm backdrop-blur-sm">
		<div class="navbar-start">
			<div class="btn btn-ghost gap-2 text-xl normal-case">
				<div
					class="bg-primary text-primary-content flex h-8 w-8 items-center justify-center rounded-lg"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
						/>
					</svg>
				</div>
				<span class="text-primary font-bold">LabelHub</span>
			</div>
		</div>
		<div class="navbar-end">
			<div class="badge badge-outline badge-sm">Secure Login</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
		<div class="w-full max-w-md">
			<!-- Hero Section -->
			<div class="mb-8 text-center">
				<div class="mb-6">
					<div class="mb-4 flex justify-center">
						<div
							class="bg-primary text-primary-content flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
						>
							<svg class="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
						</div>
					</div>
					<h1 class="text-primary mb-3 text-4xl font-bold md:text-5xl">Content Labeling</h1>
					<p class="text-base-content/70 mx-auto max-w-sm text-lg leading-relaxed">
						Help improve AI by labeling content. View items and choose between two options.
					</p>
				</div>
			</div>

			<!-- Login Card -->
			<div class="card bg-base-100 shadow-2xl">
				<div class="card-body p-8">
					<div class="mb-6 text-center">
						<h2 class="mb-2 text-2xl font-semibold">Welcome</h2>
						<p class="text-base-content/60">Sign in to start labeling content</p>
					</div>

					{#if $loading}
						<div class="flex justify-center py-8">
							<div class="loading loading-spinner loading-lg text-primary"></div>
						</div>
					{:else}
						<button class="btn btn-primary btn-lg w-full gap-3" on:click={handleGoogleLogin}>
							<svg class="h-6 w-6" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</button>

						<div class="divider text-base-content/50 text-sm">Secure Authentication</div>

						<div class="grid grid-cols-3 gap-2">
							<div class="card card-compact bg-base-200">
								<div class="card-body items-center p-3">
									<div class="mb-2 flex justify-center">
										<div
											class="bg-success text-success-content flex h-8 w-8 items-center justify-center rounded-full"
										>
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
												/>
											</svg>
										</div>
									</div>
									<div class="text-center text-xs font-medium">Secure</div>
								</div>
							</div>
							<div class="card card-compact bg-base-200">
								<div class="card-body items-center p-3">
									<div class="mb-2 flex justify-center">
										<div
											class="bg-info text-info-content flex h-8 w-8 items-center justify-center rounded-full"
										>
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
												/>
											</svg>
										</div>
									</div>
									<div class="text-center text-xs font-medium">Fast</div>
								</div>
							</div>
							<div class="card card-compact bg-base-200">
								<div class="card-body items-center p-3">
									<div class="mb-2 flex justify-center">
										<div
											class="bg-warning text-warning-content flex h-8 w-8 items-center justify-center rounded-full"
										>
											<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
												/>
											</svg>
										</div>
									</div>
									<div class="text-center text-xs font-medium">Trusted</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Footer Info -->
			<div class="mt-8 text-center">
				<p class="text-base-content/40 text-sm">Protected by enterprise-grade security</p>
			</div>
		</div>
	</div>
</div>
