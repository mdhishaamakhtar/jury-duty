<script lang="ts">
	let { size = 30, dip = false }: { size?: number; dip?: boolean } = $props();
</script>

<svg class:dip width={size} height={size} viewBox="-1 -2 34 34" aria-hidden="true">
	<g class="ballot">
		<g transform="rotate(-9 16 10)">
			<rect
				x="9.5"
				y="1.5"
				width="13"
				height="16"
				rx="1.5"
				fill="#fffdfa"
				stroke="#3f1424"
				stroke-width="2.2"
			/>
			<path
				d="M12.7 7.8l2.3 2.3 4.3-4.8"
				fill="none"
				stroke="#3f1424"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</g>
	<rect x="2" y="13.5" width="28" height="5" rx="1.5" fill="#6e1f36" />
	<path d="M4.5 18.5h23V27a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 27z" fill="#3f1424" />
</svg>

<style>
	svg {
		flex: none;
		display: block;
	}

	.dip .ballot {
		animation: dip 420ms cubic-bezier(0.3, 0.7, 0.3, 1);
	}

	@keyframes dip {
		45% {
			transform: translateY(5px);
		}
	}
</style>
