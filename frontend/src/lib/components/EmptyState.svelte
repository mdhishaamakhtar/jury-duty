<script lang="ts">
	interface Props {
		onStart: () => void;
	}

	let { onStart }: Props = $props();
</script>

<div class="py-24 text-center">
	<div class="mx-auto max-w-sm space-y-6">
		<h3 class="text-2xl font-light text-gray-700">Ready to get started?</h3>
		<button class="btn btn-primary btn-xl group" onclick={onStart}>
			<svg
				class="mr-3 h-5 w-5 transition-transform group-hover:scale-110"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 7l5 5m0 0l-5 5m5-5H6"
				/>
			</svg>
			Start Labeling
		</button>
	</div>
</div>
