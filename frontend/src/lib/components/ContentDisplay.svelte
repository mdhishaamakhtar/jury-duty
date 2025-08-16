<script lang="ts">
    import type { ContentItem } from '$lib/services/content';

    let { content }: { content: ContentItem } = $props();
</script>

<div class="rounded-2xl border border-gray-200/50 bg-white/80 p-4 backdrop-blur-sm sm:p-6 lg:p-8">
    <div
        class="post-text mx-auto max-w-sm text-justify text-base leading-relaxed font-normal text-gray-700 sm:max-w-2xl sm:text-lg lg:max-w-3xl lg:text-xl"
    >
        {content.content}
    </div>
</div>
