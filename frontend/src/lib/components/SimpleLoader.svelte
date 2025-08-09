<div class="flex min-h-[60vh] flex-col items-center justify-center space-y-8 py-32">
	<!-- Loading Animation -->
	<div class="relative">
		<div
			class="h-24 w-24 animate-spin rounded-full border-8 border-gray-200 border-t-rose-400"
		></div>
		<div class="absolute inset-0 flex items-center justify-center">
			<svg class="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
		</div>
	</div>

	<div class="text-center">
		<h3 class="mb-4 text-3xl font-light text-gray-700">Fetching Next Content</h3>
		<p class="text-xl font-light text-gray-500">Preparing your next labeling task</p>
	</div>

	<!-- Loading dots -->
	<div class="flex space-x-3">
		<div class="h-4 w-4 animate-pulse rounded-full bg-rose-400"></div>
		<div
			class="h-4 w-4 animate-pulse rounded-full bg-rose-400"
			style="animation-delay: 0.2s;"
		></div>
		<div
			class="h-4 w-4 animate-pulse rounded-full bg-rose-400"
			style="animation-delay: 0.4s;"
		></div>
	</div>
</div>
