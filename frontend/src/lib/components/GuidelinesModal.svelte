<script lang="ts">
	import { LABELING_GUIDELINES } from '$lib/config/guidelines';
	import FormattedText from './FormattedText.svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open = false, onClose }: Props = $props();

	// iOS-safe scroll lock: position:fixed instead of overflow:hidden
	let savedScrollY = 0;
	$effect(() => {
		if (open) {
			savedScrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${savedScrollY}px`;
			document.body.style.width = '100%';
		} else {
			// Delay restore until after CSS close animation (200ms) completes
			const t = setTimeout(() => {
				document.body.style.position = '';
				document.body.style.top = '';
				document.body.style.width = '';
				window.scrollTo(0, savedScrollY);
			}, 200);
			return () => clearTimeout(t);
		}

		return () => {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
		};
	});

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleEscapeKey(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleEscapeKey} />

<!--
  Always in DOM — never conditionally rendered.
  {#if open} + Svelte transitions force DOM removal which flushes Safari's
  compositor and causes a black frame. CSS opacity/visibility transitions
  on a persistent node avoid this entirely.
-->
<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:backdrop-blur-sm"
	style="
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
		transition: opacity 200ms ease, visibility 200ms ease;
		opacity: {open ? 1 : 0};
		visibility: {open ? 'visible' : 'hidden'};
		pointer-events: {open ? 'auto' : 'none'};
	"
	onclick={handleBackdropClick}
	role="presentation"
	aria-hidden={!open}
>
	<div
		class="relative my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8 sm:max-h-[calc(100dvh-4rem)]"
		style="
			transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease;
			transform: {open ? 'scale(1) translateZ(0)' : 'scale(0.94) translateZ(0)'};
			opacity: {open ? 1 : 0};
		"
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-labelledby="guidelines-title"
	>
		<!-- Header -->
		<div class="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5">
			<h2 id="guidelines-title" class="text-xl font-light text-gray-800">
				{LABELING_GUIDELINES.title}
			</h2>
			<button class="btn btn-icon" onclick={onClose} aria-label="Close guidelines">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto">
			<div class="px-6 py-8">
				<div class="post-text prose prose-gray max-w-none space-y-6 font-normal">
					<FormattedText text={LABELING_GUIDELINES.content} />
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="flex flex-shrink-0 justify-end border-t border-gray-200 px-6 py-4">
			<button class="btn btn-primary btn-lg" onclick={onClose}>Ready to Label</button>
		</div>
	</div>
</div>
