<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		labeledCount: number;
		remainingCount: number;
		open: boolean;
	}

	let { labeledCount, remainingCount, open }: Props = $props();

	const totalCount = $derived(labeledCount + remainingCount);
	const progressPercent = $derived(totalCount > 0 ? (labeledCount / totalCount) * 100 : 0);
	const circumference = $derived(2 * Math.PI * 45);
</script>

{#if open}
	<div
		class="border-b border-gray-200/50 bg-white/95 backdrop-blur-md sm:hidden"
		transition:slide={{ duration: 220, easing: cubicOut }}
	>
		<div class="mx-auto max-w-4xl px-6 py-4">
			<div class="flex items-center justify-center gap-4">
				<!-- Progress circle -->
				<div class="relative">
					<div class="h-16 w-16">
						<svg class="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="rgb(229, 231, 235)"
								stroke-width="8"
							/>
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="rgb(52, 211, 153)"
								stroke-width="8"
								stroke-dasharray={circumference}
								stroke-dashoffset={circumference * (1 - progressPercent / 100)}
								stroke-linecap="round"
								style="transition: stroke-dashoffset 500ms var(--ease-out-quint, ease-out);"
							/>
						</svg>
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-sm font-bold text-emerald-500">{Math.round(progressPercent)}%</span>
					</div>
				</div>

				<!-- Stats -->
				<div class="space-y-1 text-center">
					<div class="flex items-center justify-center gap-1">
						<div class="h-2 w-2 rounded-full bg-emerald-400"></div>
						<span class="text-sm font-medium text-gray-700">{labeledCount} labeled</span>
					</div>
					<div class="flex items-center justify-center gap-1">
						<div class="h-2 w-2 rounded-full bg-rose-300"></div>
						<span class="text-sm font-medium text-gray-500">{remainingCount} remaining</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
