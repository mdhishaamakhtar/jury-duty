<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';

	let { children } = $props();

	onMount(() => {
		authStore.initialize();
	});
</script>

{@render children()}
