<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '#lib/components/Logo.svelte';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Not found' : 'Something went wrong'} · Jury Duty</title>
</svelte:head>

<div class="screen">
	<main>
		<Logo size={72} />
		<h1>{page.status === 404 ? 'This page isn’t here.' : 'Something went wrong.'}</h1>
		<p>
			{page.status === 404
				? 'The link may be out of date, or you may not have access to it.'
				: 'Your saved verdicts are safe. Please try again in a moment.'}
		</p>
		<a href={resolve('/')}>Go home</a>
	</main>
</div>

<style>
	.screen {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		padding: 24px var(--gutter);
		background: var(--rose);
		color: var(--panel-ink);
	}

	main {
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
	}

	h1 {
		font-size: clamp(36px, 5vw, 52px);
		font-weight: 600;
		line-height: 1.08;
		letter-spacing: -0.02em;
	}

	p {
		font-size: 18px;
	}

	a {
		min-height: 52px;
		display: inline-flex;
		align-items: center;
		margin-top: 8px;
		padding: 0 24px;
		border-radius: 12px;
		background: var(--panel-ink);
		color: #fff;
		font-weight: 600;
		text-decoration: none;
	}
</style>
