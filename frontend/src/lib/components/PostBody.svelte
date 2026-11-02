<script lang="ts">
	import { parsePost, type Inline } from '#lib/post-text.ts';

	let { content }: { content: string } = $props();

	const blocks = $derived(parsePost(content));
</script>

{#snippet line(parts: Inline[])}
	{#each parts as part, index (index)}
		{#if part.type === 'link'}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external links from posts -->
			<a href={part.href} target="_blank" rel="noopener noreferrer nofollow">{part.text}</a>
		{:else if part.type === 'bold'}
			<strong>{part.text}</strong>
		{:else if part.type === 'italic'}
			<em>{part.text}</em>
		{:else if part.type === 'strike'}
			<del>{part.text}</del>
		{:else if part.type === 'code'}
			<code>{part.text}</code>
		{:else}
			{part.text}
		{/if}
	{/each}
{/snippet}

<article>
	{#each blocks as block, index (index)}
		{#if block.type === 'quote'}
			<blockquote>
				{#each block.lines as parts, row (row)}
					{#if row > 0}<br />{/if}{@render line(parts)}
				{/each}
			</blockquote>
		{:else}
			<p>
				{#each block.lines as parts, row (row)}
					{#if row > 0}<br />{/if}{@render line(parts)}
				{/each}
			</p>
		{/if}
	{/each}
</article>

<style>
	article {
		font-family: var(--read);
		font-size: clamp(21px, 1.8vw, 26px);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	p,
	blockquote {
		margin: 0 0 1em;
		text-wrap: pretty;
	}

	p:last-child,
	blockquote:last-child {
		margin-bottom: 0;
	}

	blockquote {
		padding: 2px 0 2px 16px;
		border-left: 3px solid var(--rose-track);
		color: #4c3a3e;
	}

	a {
		color: var(--wine);
		text-underline-offset: 3px;
	}

	code {
		padding: 1px 5px;
		border-radius: 4px;
		background: #f3e9e2;
		font-size: 0.85em;
	}
</style>
