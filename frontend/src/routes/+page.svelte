<script lang="ts">
	import GuidelineRules from '#lib/components/GuidelineRules.svelte';
	import Logo from '#lib/components/Logo.svelte';
	import VerdictButtons from '#lib/components/VerdictButtons.svelte';
	import type { Verdict } from '#lib/types.ts';

	let { data } = $props();

	const samples = [
		"Three months without a cigarette, then my sister's wedding happened. I said yes before I even thought about it and smoked most of a pack that weekend. Day two again.",
		"Day 212 and the cravings still show up out of nowhere. Walked past the old smoking spot at work and my hands moved to my pocket. Didn't have one.",
		"My brother started again after six years clean and I can't stop thinking about it. Any advice for talking to him without making it worse?"
	];

	let index = $state(0);
	let pending = $state<Verdict | null>(null);
	let leaving = $state(false);
	let guidesOpen = $state(false);

	function cast(verdict: Verdict) {
		if (pending) return;
		pending = verdict;
		setTimeout(() => (leaving = true), 420);
		setTimeout(() => {
			index += 1;
			pending = null;
			leaving = false;
		}, 590);
	}
</script>

<svelte:head>
	<title>Jury Duty</title>
	<meta
		name="description"
		content="Read one post at a time and decide it against the guidelines."
	/>
</svelte:head>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (guidesOpen = false)} />

<section class="hero">
	<nav>
		<span class="brand"><Logo size={32} dip={!!pending} /> jury duty</span>
		<form method="POST" action="/auth/login">
			<button class="link">Sign in</button>
		</form>
	</nav>

	<div class="hero-grid">
		<div class="pitch">
			<h1>Every post gets a fair hearing.</h1>
			<p class="lead">
				Read one post at a time and decide it against the written guidelines. Every rater judges
				independently, like a juror.
			</p>
			{#if data.signInFailed}
				<p class="notice" role="alert">Sign in didn’t finish. Please try again.</p>
			{/if}
			<div class="actions">
				<form method="POST" action="/auth/login">
					<button class="cta">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</button>
				</form>
				<button class="quiet" onclick={() => (guidesOpen = true)}>Read the guidelines</button>
			</div>
		</div>

		<div class="card">
			<p class="tag">Try it · Synthetic sample</p>
			{#key index}
				<p class="sample" class:leaving>{samples[index % samples.length]}</p>
			{/key}
			<VerdictButtons {pending} onCast={cast} showKeys={false} />
		</div>
	</div>
</section>

<section class="how">
	<div class="wrap">
		<h2>How it works</h2>
		<div class="steps">
			<div>
				<h3>Read one post</h3>
				<p>Nothing else competes for your attention. Each post gets your full judgement.</p>
			</div>
			<div>
				<h3>Check the guidelines</h3>
				<p>The written guidelines are one click away, whenever a post is a close call.</p>
			</div>
			<div>
				<h3>Cast your verdict</h3>
				<p>True or false, by click, tap or keyboard. Then the next post is ready.</p>
			</div>
		</div>
	</div>
</section>

<footer>
	<div class="wrap foot">
		<span class="foot-brand"><Logo size={24} /> jury duty</span>
		<div class="foot-links">
			<button class="link" onclick={() => (guidesOpen = true)}>Guidelines</button>
			<form method="POST" action="/auth/login">
				<button class="link">Sign in</button>
			</form>
		</div>
		<small>Confidential · Internal Use Only</small>
	</div>
</footer>

{#if guidesOpen}
	<button class="scrim" aria-label="Close guidelines" onclick={() => (guidesOpen = false)}></button>
	<div class="dialog" role="dialog" aria-modal="true" aria-label="Labeling Guidelines">
		<div class="dialog-head">
			<h2>Labeling Guidelines</h2>
			<button class="close" onclick={() => (guidesOpen = false)}>Close</button>
		</div>
		<div class="dialog-body"><GuidelineRules /></div>
	</div>
{/if}

<style>
	.hero {
		padding: 0 var(--gutter) 88px;
		background: var(--rose);
		color: var(--panel-ink);
	}

	/* Every section shares this width, so left and right edges line up down the page. */
	nav,
	.hero-grid,
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
	}

	nav {
		min-height: 76px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--read);
		font-size: 24px;
		font-weight: 600;
	}

	.hero-grid {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 56px clamp(40px, 7vw, 96px);
		padding-top: clamp(32px, 6vw, 72px);
	}

	.pitch,
	.card {
		flex: 1 1 420px;
		min-width: 0;
		animation: rise 520ms var(--ease) both;
	}

	.card {
		display: flex;
		flex-direction: column;
		min-height: 340px;
		padding: clamp(20px, 3vw, 32px);
		border-radius: 20px;
		background: var(--paper);
		box-shadow: 0 24px 60px rgba(63, 20, 36, 0.16);
		color: var(--ink);
		animation-delay: 90ms;
	}

	h1 {
		margin-bottom: 20px;
		font-size: clamp(46px, 6.2vw, 86px);
		font-weight: 600;
		line-height: 1.03;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}

	.lead {
		max-width: 30em;
		margin-bottom: 32px;
		font-size: clamp(18px, 1.5vw, 21px);
		line-height: 1.45;
		text-wrap: pretty;
	}

	.notice {
		margin-bottom: 16px;
		padding: 10px 14px;
		border: 1px solid var(--warn-edge);
		border-radius: 10px;
		background: var(--warn-tint);
		color: var(--warn-text);
		font-weight: 600;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
	}

	.cta {
		min-height: 56px;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 0 24px;
		border: 0;
		border-radius: 12px;
		background: var(--panel-ink);
		color: #fff;
		font-size: 17px;
		font-weight: 600;
	}

	.cta svg {
		width: 20px;
		height: 20px;
		fill: currentColor;
	}

	.quiet {
		min-height: 56px;
		padding: 0 20px;
		border: 0;
		border-radius: 12px;
		background: none;
		font-size: 17px;
		font-weight: 600;
	}

	@media (hover: hover) {
		.cta:hover {
			background: #4a2230;
		}

		.quiet:hover {
			background: rgba(44, 17, 25, 0.08);
		}
	}

	.tag {
		margin-bottom: 14px;
		color: var(--wine);
		font-size: 14px;
		font-weight: 600;
	}

	.sample {
		flex: 1;
		margin-bottom: 16px;
		font-family: var(--read);
		font-size: clamp(20px, 1.7vw, 23px);
		line-height: 1.5;
		text-wrap: pretty;
		animation: enter 220ms var(--ease) both;
	}

	.sample.leaving {
		animation: leave 170ms ease-in both;
	}

	.how {
		padding: 88px var(--gutter) 96px;
	}

	.how h2 {
		margin-bottom: 40px;
		font-size: clamp(30px, 3.2vw, 42px);
		font-weight: 600;
		line-height: 1.12;
		letter-spacing: -0.02em;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		gap: 32px clamp(24px, 4vw, 56px);
	}

	.steps > div {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 16px;
		border-top: 2px solid var(--ink);
	}

	.steps h3 {
		font-size: 22px;
		font-weight: 600;
		line-height: 1.25;
	}

	.steps p {
		font-size: 17px;
		text-wrap: pretty;
	}

	footer {
		padding: 28px var(--gutter);
		border-top: 1px solid var(--line);
	}

	.foot {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 12px 24px;
	}

	.foot-brand {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--read);
		font-size: 18px;
		font-weight: 600;
	}

	.foot-links {
		display: flex;
		gap: 24px;
	}

	.foot small {
		justify-self: end;
		font-size: 14px;
	}

	@media (max-width: 640px) {
		.foot {
			grid-template-columns: 1fr;
		}

		.foot small {
			justify-self: start;
		}
	}

	.scrim {
		position: fixed;
		z-index: 2;
		inset: 0;
		padding: 0;
		border: 0;
		background: rgba(44, 17, 25, 0.5);
		animation: fade 200ms ease both;
	}

	.dialog {
		position: fixed;
		z-index: 3;
		top: 24px;
		bottom: 24px;
		left: 50%;
		width: min(640px, calc(100% - 24px));
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 18px;
		background: var(--rose);
		color: var(--panel-ink);
		transform: translateX(-50%);
		animation: fade 200ms ease both;
	}

	.dialog-head {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 24px;
	}

	.dialog-head h2 {
		font-size: 22px;
		font-weight: 600;
	}

	.close {
		min-height: 44px;
		padding: 0;
		border: 0;
		background: none;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.dialog-body {
		flex: 1;
		min-height: 0;
		overflow: auto;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 8px 24px 24px;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
	}

	@keyframes enter {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}

	@keyframes leave {
		to {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}
</style>
