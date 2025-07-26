<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';

	let { children, data } = $props();

	onMount(() => {
		authStore.initialize(data);
	});
</script>

{@render children()}
