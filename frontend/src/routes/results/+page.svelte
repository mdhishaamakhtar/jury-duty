<script lang="ts">
	import { resolve } from '$app/paths';
	import Logo from '#lib/components/Logo.svelte';
	import PostBody from '#lib/components/PostBody.svelte';
	import { describeAgreement } from '#lib/agreement.ts';

	let { data } = $props();

	const totals = $derived(data.totals);
	const agreement = $derived(data.agreement);
	const trueShare = $derived(totals.verdicts ? totals.true_verdicts / totals.verdicts : 0);
	const coverage = $derived(totals.posts ? totals.labeled_posts / totals.posts : 0);
	const overlapShare = $derived(totals.posts ? agreement.posts / totals.posts : 0);
	const twoRaters = $derived(
		agreement.pairs.reduce((sum, pair) => sum + pair.n, 0) === agreement.posts
	);

	const MIN_PAIR_POSTS = 10;
	const DISPUTES_SHOWN = 12;

	let showAllPairs = $state(false);
	let showAllDisputes = $state(false);

	const solidPairs = $derived(agreement.pairs.filter((pair) => pair.n >= MIN_PAIR_POSTS));
	const shownPairs = $derived(showAllPairs ? agreement.pairs : solidPairs);
	const shownDisputes = $derived(
		showAllDisputes ? data.disagreements : data.disagreements.slice(0, DISPUTES_SHOWN)
	);

	const count = (value: number) => value.toLocaleString('en-US');
	const percent = (value: number | null, digits = 1) =>
		value === null ? '—' : `${(value * 100).toFixed(digits)}%`;
	const score = (value: number | null | undefined) => {
		if (value === null || value === undefined) return '—';
		return Math.abs(value) < 0.005 ? '0.00' : value.toFixed(2).replace('-', '−');
	};
	const position = (value: number | null) =>
		value === null ? 0 : Math.max(0, Math.min(100, ((value + 1) / 2) * 100));

	const measures = $derived([
		{
			name: 'Percent agreement',
			value: agreement.percent,
			shown: percent(agreement.percent),
			question: 'How often do two raters give the same verdict?',
			note: 'Easy to read, but it counts agreement that would happen by luck.',
			band: null
		},
		{
			name: twoRaters ? 'Scott’s π / Fleiss’ κ' : 'Fleiss’ κ',
			value: agreement.fleiss,
			shown: score(agreement.fleiss),
			question: 'How much better than chance is the agreement?',
			note:
				agreement.fleiss === null
					? 'Not shown because posts have different numbers of raters. Use Krippendorff’s α instead.'
					: 'The classic chance-corrected score. It needs the same number of raters on every post.',
			band: agreement.fleiss === null ? null : describeAgreement(agreement.fleiss)
		},
		{
			name: 'Gwet’s AC1',
			value: agreement.gwet,
			shown: score(agreement.gwet),
			question: 'What if one label is much more common?',
			note: 'Kappa can collapse when a label is rare. AC1 holds steady, so compare the two.',
			band: describeAgreement(agreement.gwet),
			interval: agreement.gwetInterval
		},
		{
			name: 'PABAK',
			value: agreement.pabak,
			shown: score(agreement.pabak),
			question: 'What if labels were equally likely by chance?',
			note: 'Removes the effect of label balance and rater bias. A large gap from kappa means they matter.',
			band: describeAgreement(agreement.pabak)
		},
		{
			name: 'Positive agreement',
			value: agreement.specific.positive,
			shown: percent(agreement.specific.positive),
			question: 'When someone says TRUE, does the other rater?',
			note: 'Shows how reliable the TRUE label is by itself.',
			band: null
		},
		{
			name: 'Negative agreement',
			value: agreement.specific.negative,
			shown: percent(agreement.specific.negative),
			question: 'When someone says FALSE, does the other rater?',
			note: 'Shows how reliable the FALSE label is by itself.',
			band: null
		}
	]);

	const reading = $derived.by(() => {
		const alpha = agreement.krippendorff;
		if (alpha === null) return 'There aren’t enough shared posts to measure agreement yet.';
		if (alpha >= 0.8) return 'Raters agree well enough to rely on these labels.';
		if (alpha >= 0.667) return 'Good enough for tentative conclusions, but worth improving.';
		return 'Below the 0.67 usually needed for tentative conclusions. Review the guidelines and the disagreements below.';
	});
</script>

<svelte:head>
	<title>Results · Jury Duty</title>
</svelte:head>

<header>
	<div class="wrap bar">
		<a class="brand" href={resolve('/label')}><Logo size={28} /> jury duty</a>
		<nav>
			<a class="link" href={resolve('/label')}>Back to labeling</a>
			<a class="link" href={resolve('/results/verdicts.csv')} download>Download CSV</a>
		</nav>
	</div>
	<div class="wrap intro">
		<h1>Results</h1>
		<p>
			{count(totals.verdicts)} verdicts from {count(totals.raters)} raters on
			{count(totals.posts)} posts.
		</p>
	</div>
</header>

<main class="wrap">
	<section class="stats" aria-label="Progress">
		<div>
			<span class="big">{percent(coverage)}</span>
			<span class="caption">of posts have a verdict</span>
			<div class="meter" aria-hidden="true"><span style:width="{coverage * 100}%"></span></div>
			<small>{count(totals.labeled_posts)} of {count(totals.posts)}</small>
		</div>
		<div>
			<span class="big">{percent(overlapShare)}</span>
			<span class="caption">have two or more raters</span>
			<div class="meter" aria-hidden="true"><span style:width="{overlapShare * 100}%"></span></div>
			<small>{count(agreement.posts)} posts can be compared</small>
		</div>
		<div>
			<span class="big">{percent(trueShare)}</span>
			<span class="caption">of verdicts are TRUE</span>
			<div class="split" aria-hidden="true">
				<span class="t" style:width="{trueShare * 100}%"></span>
				<span class="f"></span>
			</div>
			<small>
				{count(totals.true_verdicts)} TRUE · {count(totals.verdicts - totals.true_verdicts)} FALSE
			</small>
		</div>
	</section>

	<section>
		<h2>Inter-rater agreement</h2>
		<p class="section-note">
			Measured on the {count(agreement.posts)} posts labeled by at least two of
			{agreement.raters} raters.
		</p>

		{#if agreement.posts && overlapShare < 0.1}
			<p class="caution">
				Only {percent(overlapShare)} of posts have a second rater, so these scores describe a small sample
				of the data. More overlap gives a firmer answer.
			</p>
		{/if}

		<div class="headline">
			<div>
				<p class="eyebrow">Krippendorff’s α</p>
				<p class="alpha">{score(agreement.krippendorff)}</p>
				{#if agreement.krippendorffInterval}
					<p class="interval">
						95% interval {score(agreement.krippendorffInterval.low)} to
						{score(agreement.krippendorffInterval.high)}
					</p>
				{/if}
			</div>
			<div class="headline-text">
				<p class="band">{describeAgreement(agreement.krippendorff)}</p>
				<p>{reading}</p>
				<div class="scale" aria-hidden="true">
					<span class="mark" style:left="{position(agreement.krippendorff)}%"></span>
					<span class="tick" style:left="{position(0.667)}%"><small>0.67</small></span>
					<span class="tick" style:left="{position(0.8)}%"><small>0.80</small></span>
					<span class="tick" style:left="50%"><small>0</small></span>
				</div>
				<p class="fine">
					It corrects for chance and handles any number of raters per post, so it’s the main score
					here.
				</p>
			</div>
		</div>

		<div class="measures">
			{#each measures as measure (measure.name)}
				<article>
					<div class="measure-top">
						<h3>{measure.name}</h3>
						{#if measure.band}<span class="chip">{measure.band}</span>{/if}
					</div>
					<p class="value">{measure.shown}</p>
					{#if measure.interval}
						<p class="interval">
							95% interval {score(measure.interval.low)} to {score(measure.interval.high)}
						</p>
					{/if}
					<p class="question">{measure.question}</p>
					<p class="fine">{measure.note}</p>
				</article>
			{/each}
		</div>
	</section>

	{#if agreement.pairs.length}
		<section>
			<h2>Rater pairs</h2>
			<p class="section-note">
				Cohen’s κ for each pair, which shows who is reading the guidelines differently. Fewer than
				20 shared posts gives a rough estimate.
			</p>
			<div class="scroll">
				<table>
					<thead>
						<tr>
							<th>Raters</th>
							<th class="num">Shared posts</th>
							<th class="num">Agreement</th>
							<th class="num">Cohen’s κ</th>
							<th>Reading</th>
						</tr>
					</thead>
					<tbody>
						{#each shownPairs as pair (`${pair.a}|${pair.b}`)}
							<tr class:thin={pair.n < 20}>
								<td><span class="who">{pair.a}</span><span class="who">{pair.b}</span></td>
								<td class="num">{pair.n}</td>
								<td class="num">{percent(pair.agreement, 0)}</td>
								<td class="num strong">{score(pair.kappa)}</td>
								<td>{pair.n < MIN_PAIR_POSTS ? 'Too few posts' : describeAgreement(pair.kappa)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if solidPairs.length < agreement.pairs.length}
				<button class="more" onclick={() => (showAllPairs = !showAllPairs)}>
					{showAllPairs
						? `Show pairs with ${MIN_PAIR_POSTS}+ shared posts`
						: `Show ${agreement.pairs.length - solidPairs.length} pairs with fewer than ${MIN_PAIR_POSTS} shared posts`}
				</button>
			{/if}
		</section>
	{/if}

	<section>
		<h2>Raters</h2>
		<p class="section-note">
			A TRUE rate far from {percent(trueShare, 0)} can mean a rater reads the guidelines more strictly
			or loosely, or simply saw different posts.
		</p>
		<div class="scroll">
			<table>
				<thead>
					<tr>
						<th>Rater</th>
						<th class="num">Verdicts</th>
						<th class="wide">Share of work</th>
						<th class="num">TRUE rate</th>
					</tr>
				</thead>
				<tbody>
					{#each data.raters as rater (rater.rater)}
						<tr>
							<td><span class="who">{rater.email}</span></td>
							<td class="num">{count(rater.verdicts)}</td>
							<td class="wide">
								<div class="meter small" aria-hidden="true">
									<span style:width="{(rater.verdicts / totals.verdicts) * 100}%"></span>
								</div>
							</td>
							<td class="num">{percent(rater.true_verdicts / rater.verdicts, 0)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section>
		<h2>Posts raters disagreed on</h2>
		<p class="section-note">
			{#if data.disagreements.length}
				These are the best examples to add to the guidelines.
			{:else}
				No disagreements yet.
			{/if}
		</p>
		<div class="disputes">
			{#each shownDisputes as post (post.post)}
				<article>
					<div class="votes">
						<span class="vote t">{post.true_votes} TRUE</span>
						<span class="vote f">{post.false_votes} FALSE</span>
					</div>
					<details>
						<summary>{post.content.slice(0, 180)}{post.content.length > 180 ? '…' : ''}</summary>
						{#if post.content.length > 180}
							<div class="full"><PostBody content={post.content} /></div>
						{/if}
					</details>
				</article>
			{/each}
		</div>
		{#if data.disagreements.length > DISPUTES_SHOWN}
			<button class="more" onclick={() => (showAllDisputes = !showAllDisputes)}>
				{showAllDisputes ? 'Show fewer' : `Show all ${data.disagreements.length}`}
			</button>
		{/if}
	</section>
</main>

<style>
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
	}

	header {
		padding: 0 var(--gutter) 40px;
		background: var(--rose);
		color: var(--panel-ink);
	}

	.bar {
		min-height: 76px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px 24px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		color: inherit;
		font-family: var(--read);
		font-size: 24px;
		font-weight: 600;
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 20px;
	}

	.intro {
		padding-top: 24px;
	}

	h1 {
		font-size: clamp(42px, 5vw, 64px);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.025em;
	}

	.intro p {
		margin-top: 8px;
		font-size: 18px;
	}

	main.wrap {
		/* The padding sits inside this box, so it's added to line up with the header. */
		max-width: calc(1240px + 2 * var(--gutter));
		padding: 0 var(--gutter) 96px;
	}

	section {
		margin-top: 64px;
	}

	h2 {
		font-size: clamp(26px, 2.6vw, 34px);
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.section-note {
		max-width: 44em;
		margin-top: 6px;
		color: #5b4a4e;
		font-size: 17px;
		text-wrap: pretty;
	}

	.caution {
		max-width: 44em;
		margin-top: 12px;
		padding: 10px 14px;
		border: 1px solid var(--warn-edge);
		border-radius: 10px;
		background: var(--warn-tint);
		color: var(--warn-text);
		font-weight: 500;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		gap: 32px clamp(24px, 4vw, 56px);
		margin-top: 48px;
	}

	.stats > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 16px;
		border-top: 2px solid var(--ink);
	}

	.big {
		font-size: 44px;
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.caption {
		font-size: 17px;
	}

	small {
		color: #5b4a4e;
		font-size: 14px;
	}

	.meter,
	.split {
		height: 8px;
		margin-top: 10px;
		display: flex;
		overflow: hidden;
		border-radius: 4px;
		background: #f0e4dc;
	}

	.meter span {
		background: var(--rose-deep);
	}

	.meter.small {
		height: 6px;
		margin-top: 0;
		min-width: 120px;
	}

	.split .t {
		background: var(--true);
	}

	.split .f {
		flex: 1;
		background: var(--false);
	}

	.headline {
		display: grid;
		grid-template-columns: minmax(220px, 300px) 1fr;
		gap: 24px 48px;
		margin-top: 24px;
		padding: clamp(24px, 3vw, 36px);
		border-radius: 20px;
		background: var(--rose);
		color: var(--panel-ink);
	}

	.eyebrow {
		font-size: 16px;
		font-weight: 600;
	}

	.alpha {
		font-size: clamp(72px, 9vw, 112px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
	}

	.interval {
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}

	.band {
		font-size: 26px;
		font-weight: 600;
		line-height: 1.2;
	}

	.headline-text > p:nth-child(2) {
		max-width: 38em;
		margin-top: 4px;
		font-size: 17px;
		text-wrap: pretty;
	}

	.scale {
		position: relative;
		height: 6px;
		margin: 28px 0 34px;
		border-radius: 3px;
		background: var(--rose-track);
	}

	.mark {
		position: absolute;
		top: 50%;
		width: 16px;
		height: 16px;
		border: 3px solid var(--rose);
		border-radius: 50%;
		background: var(--panel-ink);
		transform: translate(-50%, -50%);
	}

	.tick {
		position: absolute;
		top: 12px;
		transform: translateX(-50%);
	}

	.tick small {
		color: inherit;
		font-variant-numeric: tabular-nums;
	}

	.fine {
		color: #5b4a4e;
		font-size: 15px;
		line-height: 1.4;
		text-wrap: pretty;
	}

	.headline .fine {
		color: inherit;
	}

	.measures {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
		gap: 16px;
		margin-top: 16px;
	}

	.measures article {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 20px 22px;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--surface);
	}

	.measure-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	h3 {
		font-size: 17px;
		font-weight: 600;
	}

	.chip {
		flex: none;
		padding: 2px 10px;
		border-radius: 999px;
		background: var(--rose);
		color: var(--panel-ink);
		font-size: 14px;
		font-weight: 600;
	}

	.value {
		font-size: 40px;
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.question {
		margin-top: 8px;
		font-weight: 600;
	}

	.scroll {
		margin-top: 20px;
		overflow-x: auto;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--surface);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 16px;
	}

	th {
		padding: 12px 16px;
		border-bottom: 1px solid var(--line);
		font-size: 14px;
		font-weight: 600;
		text-align: left;
		white-space: nowrap;
	}

	td {
		padding: 12px 16px;
		border-bottom: 1px solid #f0e4dc;
	}

	tr:last-child td {
		border-bottom: 0;
	}

	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.strong {
		font-weight: 600;
	}

	.wide {
		width: 40%;
	}

	.thin td {
		color: #6b5a5e;
	}

	.who {
		display: block;
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.more {
		min-height: 44px;
		margin-top: 12px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--surface);
		font-weight: 600;
	}

	.disputes {
		display: flex;
		flex-direction: column;
		margin-top: 20px;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--surface);
	}

	.disputes:empty {
		display: none;
	}

	.disputes article {
		display: grid;
		grid-template-columns: 170px 1fr;
		gap: 8px 20px;
		padding: 16px 20px;
		border-bottom: 1px solid #f0e4dc;
	}

	.disputes article:last-child {
		border-bottom: 0;
	}

	.votes {
		display: flex;
		align-items: flex-start;
		gap: 6px;
	}

	.vote {
		padding: 1px 8px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}

	.vote.t {
		background: var(--true-tint);
		color: var(--true-text);
	}

	.vote.f {
		background: var(--false-tint);
		color: var(--false-text);
	}

	summary {
		cursor: pointer;
		font-family: var(--read);
		font-size: 17px;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.full {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #f0e4dc;
	}

	.full :global(article) {
		font-size: 17px;
	}

	@media (max-width: 720px) {
		.headline {
			grid-template-columns: 1fr;
		}

		.disputes article {
			grid-template-columns: 1fr;
		}

		.wide {
			display: none;
		}

		.who {
			max-width: 190px;
		}
	}
</style>
