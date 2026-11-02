<script lang="ts">
	import type { Verdict } from '#lib/types.ts';

	let {
		pending,
		onCast,
		showKeys = true
	}: { pending: Verdict | null; onCast: (verdict: Verdict) => void; showKeys?: boolean } = $props();

	const stateOf = (verdict: Verdict) => (!pending ? '' : pending === verdict ? 'on' : 'off');
</script>

<div class="verdicts">
	<button
		type="button"
		class="v t {stateOf('TRUE')}"
		aria-pressed={pending === 'TRUE'}
		onclick={() => onCast('TRUE')}
	>
		<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8" /></svg>
		True
		{#if showKeys}<kbd>1</kbd>{/if}
	</button>
	<button
		type="button"
		class="v f {stateOf('FALSE')}"
		aria-pressed={pending === 'FALSE'}
		onclick={() => onCast('FALSE')}
	>
		<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
		False
		{#if showKeys}<kbd>2</kbd>{/if}
	</button>
</div>

<style>
	.verdicts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.v {
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: 1px solid;
		border-radius: 12px;
		font-size: 18px;
		font-weight: 600;
		transition:
			background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease,
			opacity 120ms ease,
			transform 120ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.v:active {
		transform: scale(0.985);
	}

	.t {
		border-color: var(--true-edge);
		background: var(--true-tint);
		color: var(--true-text);
	}

	.f {
		border-color: var(--false-edge);
		background: var(--false-tint);
		color: var(--false-text);
	}

	@media (hover: hover) {
		.t:hover {
			background: var(--true-hover);
		}

		.f:hover {
			background: var(--false-hover);
		}
	}

	.t.on {
		border-color: var(--true);
		background: var(--true);
		color: #fff;
	}

	.f.on {
		border-color: var(--false);
		background: var(--false);
		color: #fff;
	}

	.off {
		opacity: 0.4;
	}

	svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.on svg {
		animation: pop 240ms cubic-bezier(0.2, 0.9, 0.3, 1);
	}

	kbd {
		font: inherit;
		font-size: 14px;
		opacity: 0.7;
	}

	@keyframes pop {
		0% {
			transform: scale(0.6);
		}
		60% {
			transform: scale(1.25);
		}
	}

	@media (max-width: 820px) {
		.verdicts {
			gap: 8px;
		}

		.v {
			height: 54px;
			gap: 8px;
		}

		kbd {
			display: none;
		}
	}
</style>
