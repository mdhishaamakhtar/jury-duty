<script lang="ts">
	import { guidelines } from '#lib/guidelines.ts';
</script>

<p class="intro">{guidelines.intro}</p>

<section class="true">
	<h3>{guidelines.trueMeans}</h3>
	<ul>
		{#each guidelines.trueRules as rule (rule)}
			<li>
				<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8" /></svg>
				<span>{rule}</span>
			</li>
		{/each}
	</ul>
</section>

<section class="false">
	<h3>{guidelines.falseMeans}</h3>
	<ul>
		{#each guidelines.falseRules as rule (rule)}
			<li>
				<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
				<span>{rule}</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.intro {
		font-size: 16px;
		line-height: 1.45;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px;
		border-radius: 12px;
		background: var(--paper);
		color: var(--ink);
	}

	h3 {
		font-size: 16px;
		font-weight: 600;
	}

	.true h3 {
		color: var(--true-text);
	}

	.false h3 {
		color: var(--false-text);
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		gap: 10px;
		line-height: 1.4;
	}

	svg {
		flex: none;
		width: 16px;
		height: 16px;
		margin-top: 3px;
		fill: none;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.true svg {
		stroke: var(--true);
	}

	.false svg {
		stroke: var(--false);
	}
</style>
