/**
 * Formats text with Reddit-style formatting and handles HTML entities
 * Assumes JSON parsing has already handled escape sequences naturally
 */
export function formatRedditText(text: string): string {
	if (!text) return '';

	let formatted = text;

	// 1. Decode HTML entities first
	formatted = formatted
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#x27;/g, "'")
		.replace(/&#x2F;/g, '/')
		.replace(/&#39;/g, "'")
		.replace(/&#x60;/g, '`')
		.replace(/&#x3D;/g, '=');

	// 2. Apply Reddit formatting
	formatted = formatted
		// Handle bold text **text**
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')

		// Handle italic text *text*
		.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')

		// Handle strikethrough ~~text~~
		.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>')

		// Handle quotes >text (line by line)
		.replace(
			/^>\s*(.*)$/gm,
			'<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-2 bg-gray-50 text-gray-700 italic">$1</blockquote>'
		)

		// Handle code `code`
		.replace(
			/`([^`]+)`/g,
			'<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>'
		)

		// Handle URLs and add word-break for overflow
		.replace(
			/(https?:\/\/[^\s]+)/g,
			'<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all">$1</a>'
		)

		// Handle Reddit-style links [text](url)
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all">$1</a>'
		);

	// Handle whitespace characters for HTML display
	formatted = formatted
		.replace(/\n/g, '<br>') // Each newline = line break
		.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // Each tab = 4 non-breaking spaces

	return formatted;
}
