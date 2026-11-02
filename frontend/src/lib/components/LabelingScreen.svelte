<script lang="ts">
	import { resolve } from '$app/paths';
	import GuidelineRules from '#lib/components/GuidelineRules.svelte';
	import Logo from '#lib/components/Logo.svelte';
	import PostBody from '#lib/components/PostBody.svelte';
	import VerdictButtons from '#lib/components/VerdictButtons.svelte';
	import { jury } from '#lib/jury.config.ts';
	import { verdictForKey } from '#lib/keyboard.ts';
	import type { LabelingSession } from '#lib/labeling.svelte.ts';

	let {
		session,
		owner = false,
		demo = false
	}: { session: LabelingSession; owner?: boolean; demo?: boolean } = $props();

	const { guidelines } = jury;

	let guidesOpen = $state(false);
	let helpOpen = $state(false);
	let reader = $state<HTMLElement>();

	const format = (value: number) => value.toLocaleString('en-US');

	$effect(() => {
		if (session.post) reader?.scrollTo(0, 0);
	});

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			guidesOpen = false;
			helpOpen = false;
		}
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		if (event.key === '?') helpOpen = !helpOpen;
		if (guidesOpen || helpOpen || !session.post) return;
		if (event.key.toLowerCase() === 'g') guidesOpen = true;
		if (event.key.toLowerCase() === 'u') session.undo();
		const verdict = verdictForKey(event);
		if (verdict) {
			event.preventDefault();
			session.cast(verdict);
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#snippet signOut(className: string)}
	{#if demo}
		<a class={className} href={resolve('/')}>Exit demo</a>
	{:else}
		<form method="POST" action="/auth/signout">
			<button class={className}>Sign out</button>
		</form>
	{/if}
{/snippet}

{#if session.post}
	<div class="app">
		<aside class:wide={guidesOpen}>
			<div class="brand"><Logo dip={!!session.pending} /> jury duty</div>
			<div class="panel-body">
				{#if guidesOpen}
					<h2>Labeling Guidelines</h2>
					<GuidelineRules />
				{:else}
					<h1>{guidelines.summary}</h1>
					<p class="means">{guidelines.trueMeans}<br />{guidelines.falseMeans}</p>
				{/if}
			</div>
			<div
				class="meter"
				role="progressbar"
				aria-label="Posts labeled"
				aria-valuenow={session.post.labeled_count}
				aria-valuemax={session.total}
			>
				<span style:width="{session.percent}%"></span>
			</div>
			<div class="panel-foot">
				<span aria-live="polite"
					>{format(session.post.labeled_count)} of {format(session.total)}</span
				>
				<div>
					{#if owner}<a class="link" href={resolve('/results')}>Results</a>{/if}
					<button
						class="link"
						aria-expanded={guidesOpen}
						onclick={() => (guidesOpen = !guidesOpen)}
					>
						{guidesOpen ? 'Close' : 'Guidelines'}
					</button>
					{@render signOut('link')}
				</div>
			</div>
		</aside>

		<div class="work">
			<header>
				<div class="bar">
					<span class="brand"><Logo size={27} dip={!!session.pending} /> jury duty</span>
					{#if owner}<a class="link" href={resolve('/results')}>Results</a>{/if}
					<button class="link" onclick={() => (guidesOpen = true)}>Guidelines</button>
					{@render signOut('link')}
				</div>
				<div class="bar-progress">
					<div class="meter" aria-hidden="true"><span style:width="{session.percent}%"></span></div>
					<span>{format(session.post.labeled_count)} of {format(session.total)}</span>
				</div>
			</header>

			<main bind:this={reader}>
				<div class="column">
					<div class="instruction">
						<p>{guidelines.summary}</p>
						<p class="means">{guidelines.trueMeans} · {guidelines.falseMeans}</p>
					</div>
					{#key session.post.id}
						<div class="post" class:leaving={session.leaving}>
							<PostBody content={session.post.content} />
						</div>
					{/key}
				</div>
			</main>

			<div class="notices" aria-live="polite">
				{#if demo}
					<p class="notice">Demo with made-up posts. Nothing you do here is saved.</p>
				{/if}
				{#if session.lastVerdict}
					<p class="notice">
						Saved {session.lastVerdict}
						<button class="link" onclick={() => session.undo()}>Undo</button>
					</p>
				{/if}
				{#if session.undoExpired}
					<p class="notice">That verdict can no longer be undone.</p>
				{/if}
				{#if session.breakDue}
					<p class="notice">
						That’s 50 posts. A short break keeps your judgement sharp.
						<button class="link" onclick={() => session.dismissBreak()}>Got it</button>
					</p>
				{/if}
			</div>

			<div class="dock">
				<div class="column">
					{#if session.failed}
						<div class="failed" role="alert">
							<p>Your {session.failed} verdict didn’t save.</p>
							<button onclick={() => session.retry()}>Try again</button>
						</div>
					{:else}
						<VerdictButtons pending={session.pending} onCast={(verdict) => session.cast(verdict)} />
					{/if}
				</div>
			</div>
		</div>

		{#if helpOpen}
			<button class="help-scrim" aria-label="Close shortcuts" onclick={() => (helpOpen = false)}
			></button>
			<div class="help" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
				<div class="sheet-head">
					<h2>Keyboard shortcuts</h2>
					<button class="link" onclick={() => (helpOpen = false)}>Close</button>
				</div>
				<dl>
					<dt><kbd>1</kbd> <kbd>T</kbd> <kbd>←</kbd></dt>
					<dd>True</dd>
					<dt><kbd>2</kbd> <kbd>F</kbd> <kbd>→</kbd></dt>
					<dd>False</dd>
					<dt><kbd>U</kbd></dt>
					<dd>Undo the last verdict</dd>
					<dt><kbd>G</kbd></dt>
					<dd>Open the guidelines</dd>
					<dt><kbd>?</kbd></dt>
					<dd>Show this list</dd>
				</dl>
			</div>
		{/if}

		{#if guidesOpen}
			<button class="scrim" aria-label="Close guidelines" onclick={() => (guidesOpen = false)}
			></button>
			<div class="sheet" role="dialog" aria-modal="true" aria-label="Labeling Guidelines">
				<div class="sheet-head">
					<h2>Labeling Guidelines</h2>
					<button class="link" onclick={() => (guidesOpen = false)}>Close</button>
				</div>
				<div class="sheet-body"><GuidelineRules /></div>
			</div>
		{/if}
	</div>
{:else}
	<div class="done">
		<span class="done-brand">jury duty</span>
		<main>
			<Logo size={104} dip />
			<h1>That’s every post.</h1>
			<p>
				Your verdicts are saved and there’s nothing left for you to review. Thank you for your
				judgement.
			</p>
			{@render signOut('cta')}
		</main>
	</div>
{/if}

<style>
	.app {
		height: 100dvh;
		display: flex;
		background: var(--paper);
	}

	aside {
		flex: 0 0 340px;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 26px 30px 28px;
		background: var(--rose);
		color: var(--panel-ink);
		transition: flex-basis 200ms var(--ease);
	}

	aside.wide {
		flex-basis: 460px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--read);
		font-size: 25px;
		font-weight: 600;
	}

	.panel-body {
		flex: 1;
		min-height: 0;
		overflow: auto;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding-top: 8px;
	}

	aside h1 {
		font-size: 22px;
		font-weight: 600;
		line-height: 1.3;
		text-wrap: pretty;
	}

	h2 {
		font-size: 24px;
		font-weight: 600;
		line-height: 1.2;
	}

	.means {
		font-size: 15px;
		font-weight: 600;
	}

	.meter {
		height: 6px;
		border-radius: 3px;
		background: var(--rose-track);
		overflow: hidden;
	}

	.meter span {
		display: block;
		height: 100%;
		border-radius: 3px;
		background: var(--rose-deep);
		transition: width 200ms var(--ease);
	}

	.panel-foot {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		font-size: 16px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.panel-foot div {
		display: flex;
		gap: 14px;
	}

	.work {
		position: relative;
		flex: 1;
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

	header,
	.instruction,
	.scrim,
	.sheet {
		display: none;
	}

	main {
		flex: 1;
		min-height: 0;
		overflow: auto;
		display: flex;
		padding: 40px 64px;
	}

	.column {
		width: 100%;
		max-width: 720px;
		margin: auto;
	}

	.post {
		animation: enter 220ms var(--ease) both;
	}

	.post.leaving {
		animation: leave 170ms ease-in both;
	}

	.notices {
		position: absolute;
		z-index: 1;
		left: 50%;
		bottom: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: max-content;
		max-width: calc(100% - 28px);
		transform: translateX(-50%);
		pointer-events: none;
	}

	.notice {
		display: flex;
		gap: 12px;
		padding: 8px 14px;
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--surface);
		box-shadow: 0 6px 20px rgba(63, 20, 36, 0.1);
		font-size: 15px;
		font-weight: 500;
		pointer-events: auto;
		animation: enter 180ms var(--ease) both;
	}

	.help-scrim {
		position: fixed;
		z-index: 2;
		inset: 0;
		padding: 0;
		border: 0;
		background: rgba(44, 17, 25, 0.5);
		animation: fade 200ms ease both;
	}

	.help {
		position: fixed;
		z-index: 3;
		top: 50%;
		left: 50%;
		width: min(420px, calc(100% - 28px));
		padding: 8px 22px 22px;
		border-radius: 18px;
		background: var(--surface);
		transform: translate(-50%, -50%);
		animation: fade 200ms ease both;
	}

	.help .sheet-head {
		display: flex;
		min-height: 52px;
		align-items: center;
		justify-content: space-between;
	}

	.help h2 {
		font-size: 20px;
	}

	.help dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 10px 20px;
		margin: 8px 0 0;
	}

	.help dt {
		display: flex;
		gap: 4px;
	}

	.help dd {
		margin: 0;
	}

	.help kbd {
		min-width: 26px;
		padding: 1px 7px;
		border: 1px solid var(--line);
		border-radius: 6px;
		background: var(--paper);
		font: inherit;
		font-size: 14px;
		text-align: center;
	}

	.dock {
		flex: none;
		padding: 14px 64px 24px;
		border-top: 1px solid var(--line);
	}

	.failed {
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 0 8px 0 18px;
		border: 1px solid var(--warn-edge);
		border-radius: 12px;
		background: var(--warn-tint);
		color: var(--warn-text);
		font-weight: 600;
	}

	.failed button {
		flex: none;
		height: 44px;
		padding: 0 18px;
		border: 0;
		border-radius: 8px;
		background: var(--panel-ink);
		color: #fff;
		font-weight: 600;
	}

	.done {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		padding: 0 clamp(18px, 5vw, 72px);
		background: var(--rose);
		color: var(--panel-ink);
	}

	.done-brand {
		padding: 22px 0;
		font-family: var(--read);
		font-size: 24px;
		font-weight: 600;
	}

	.done main {
		flex: none;
		width: 100%;
		max-width: 560px;
		margin: auto;
		padding: 0 0 72px;
		overflow: visible;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}

	.done h1 {
		font-size: clamp(42px, 5vw, 64px);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.025em;
	}

	.done p {
		font-size: clamp(18px, 1.5vw, 20px);
		line-height: 1.45;
	}

	.done :global(.cta) {
		min-height: 56px;
		padding: 0 28px;
		border: 0;
		border-radius: 12px;
		background: var(--panel-ink);
		color: #fff;
		font-size: 17px;
		font-weight: 600;
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

	@keyframes sheet {
		from {
			transform: translateY(100%);
		}
	}

	@media (max-width: 820px) {
		aside {
			display: none;
		}

		header {
			flex: none;
			display: block;
			background: var(--rose);
			color: var(--panel-ink);
		}

		.bar {
			height: 56px;
			display: flex;
			align-items: center;
			gap: 16px;
			padding: 0 16px;
			font-size: 16px;
		}

		.bar .brand {
			flex: 1;
			gap: 8px;
			font-size: 22px;
		}

		.bar-progress {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 0 16px 10px;
			font-size: 14px;
			font-weight: 600;
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
		}

		.bar-progress .meter {
			flex: 1;
		}

		main {
			display: block;
			padding: 16px 18px 24px;
		}

		.column {
			margin: 0 auto;
		}

		.instruction {
			display: flex;
			flex-direction: column;
			gap: 3px;
			margin-bottom: 16px;
			padding-bottom: 14px;
			border-bottom: 1px solid var(--line);
			line-height: 1.35;
		}

		.instruction .means {
			color: var(--wine);
			font-size: 14px;
		}

		.notices {
			bottom: 86px;
		}

		.dock {
			padding: 10px 14px max(14px, env(safe-area-inset-bottom));
		}

		.failed {
			height: 54px;
			padding: 0 6px 0 14px;
		}

		.scrim {
			position: fixed;
			z-index: 2;
			inset: 0;
			display: block;
			padding: 0;
			border: 0;
			background: rgba(44, 17, 25, 0.5);
			animation: fade 200ms ease both;
		}

		.sheet {
			position: fixed;
			z-index: 3;
			inset: 56px 0 0;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			border-radius: 18px 18px 0 0;
			background: var(--rose);
			color: var(--panel-ink);
			animation: sheet 280ms var(--ease) both;
		}

		.sheet-head {
			flex: none;
			min-height: 56px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 18px;
		}

		.sheet-body {
			flex: 1;
			min-height: 0;
			overflow: auto;
			display: flex;
			flex-direction: column;
			gap: 14px;
			padding: 4px 16px max(24px, env(safe-area-inset-bottom));
		}
	}
</style>
