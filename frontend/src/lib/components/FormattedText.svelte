<script lang="ts">
	interface TextSegment {
		type: 'text' | 'bold' | 'italic' | 'strikethrough' | 'code' | 'link' | 'quote' | 'break';
		content: string;
		href?: string;
		linkText?: string;
	}

	let { text }: { text: string } = $props();

	function parseRedditText(input: string): TextSegment[] {
		if (!input) return [];
		
		const segments: TextSegment[] = [];
		let remaining = input;

		// Decode HTML entities first
		remaining = remaining
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<')
			.replace(/&amp;/g, '&')
			.replace(/&quot;/g, '"')
			.replace(/&#x27;/g, "'")
			.replace(/&#x2F;/g, '/')
			.replace(/&#39;/g, "'")
			.replace(/&#x60;/g, '`')
			.replace(/&#x3D;/g, '=');

		// Split by lines to handle quotes properly
		const lines = remaining.split('\n');
		
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			
			// Handle quotes (entire line)
			if (line.match(/^>\s*/)) {
				segments.push({
					type: 'quote',
					content: line.replace(/^>\s*/, '')
				});
			} else {
				// Parse inline formatting
				parseInlineFormatting(line, segments);
			}
			
			// Add line break if not last line
			if (i < lines.length - 1) {
				segments.push({ type: 'break', content: '' });
			}
		}

		return segments;
	}

	function parseInlineFormatting(text: string, segments: TextSegment[]) {
		let remaining = text;
		
		// Regex patterns for different formats
		const patterns = [
			{ type: 'link', regex: /\[([^\]]+)\]\(([^)]+)\)/ },
			{ type: 'bold', regex: /\*\*(.*?)\*\*/ },
			{ type: 'italic', regex: /\*(.*?)\*/ },
			{ type: 'strikethrough', regex: /~~(.*?)~~/ },
			{ type: 'code', regex: /`([^`]+)`/ }
		];

		while (remaining.length > 0) {
			let matched = false;
			let earliestMatch = { index: remaining.length, type: '', match: null as any };

			// Find the earliest match
			for (const pattern of patterns) {
				const match = remaining.match(pattern.regex);
				if (match && match.index !== undefined && match.index < earliestMatch.index) {
					earliestMatch = { index: match.index, type: pattern.type, match };
				}
			}

			if (earliestMatch.match) {
				// Add text before the match
				if (earliestMatch.index > 0) {
					segments.push({
						type: 'text',
						content: remaining.slice(0, earliestMatch.index)
					});
				}

				// Add the formatted segment
				const match = earliestMatch.match;
				if (earliestMatch.type === 'link') {
					segments.push({
						type: 'link',
						content: match[2], // URL
						linkText: match[1] // Link text
					});
				} else {
					segments.push({
						type: earliestMatch.type as any,
						content: match[1] // Content inside formatting
					});
				}

				remaining = remaining.slice(earliestMatch.index + match[0].length);
				matched = true;
			} else {
				// No more matches, add remaining text
				if (remaining.length > 0) {
					segments.push({
						type: 'text',
						content: remaining
					});
				}
				break;
			}
		}
	}

	const segments = $derived(parseRedditText(text));
</script>

<div class="text-justify leading-relaxed">
	{#each segments as segment}
		{#if segment.type === 'text'}
			<span>{segment.content}</span>
		{:else if segment.type === 'bold'}
			<strong class="font-semibold text-gray-900">{segment.content}</strong>
		{:else if segment.type === 'italic'}
			<em class="italic text-gray-700">{segment.content}</em>
		{:else if segment.type === 'strikethrough'}
			<del class="line-through text-gray-500">{segment.content}</del>
		{:else if segment.type === 'code'}
			<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">{segment.content}</code>
		{:else if segment.type === 'link'}
			<a href={segment.content} target="_blank" rel="noopener noreferrer" 
			   class="text-blue-600 hover:text-blue-800 underline whitespace-nowrap">{segment.linkText}</a>
		{:else if segment.type === 'quote'}
			<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-2 bg-gray-50 text-gray-700 italic block">{segment.content}</blockquote>
		{:else if segment.type === 'break'}
			<br>
		{/if}
	{/each}
</div>