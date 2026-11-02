export type Inline =
	| { type: 'text' | 'bold' | 'italic' | 'strike' | 'code'; text: string }
	| { type: 'link'; text: string; href: string };

export type Block = { type: 'paragraph' | 'quote'; lines: Inline[][] };

const entities: Record<string, string> = {
	'&gt;': '>',
	'&lt;': '<',
	'&amp;': '&',
	'&quot;': '"',
	'&#x27;': "'",
	'&#39;': "'",
	'&#x2F;': '/',
	'&#x60;': '`',
	'&#x3D;': '='
};

const decode = (text: string) =>
	text.replace(/&(?:gt|lt|amp|quot|#x27|#39|#x2F|#x60|#x3D);/g, (match) => entities[match]);

const inlinePattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~|`([^`]+)`/g;

// Posts are untrusted, so only web links become clickable.
const safeHref = (href: string) => (/^https?:\/\//i.test(href) ? href : null);

const parseInline = (line: string): Inline[] => {
	const parts: Inline[] = [];
	let cursor = 0;
	for (const match of line.matchAll(inlinePattern)) {
		if (match.index > cursor) parts.push({ type: 'text', text: line.slice(cursor, match.index) });
		const [whole, linkText, href, bold, italic, strike, code] = match;
		if (linkText !== undefined) {
			const url = safeHref(href);
			parts.push(url ? { type: 'link', text: linkText, href: url } : { type: 'text', text: whole });
		} else if (bold !== undefined) parts.push({ type: 'bold', text: bold });
		else if (italic !== undefined) parts.push({ type: 'italic', text: italic });
		else if (strike !== undefined) parts.push({ type: 'strike', text: strike });
		else parts.push({ type: 'code', text: code });
		cursor = match.index + whole.length;
	}
	if (cursor < line.length) parts.push({ type: 'text', text: line.slice(cursor) });
	return parts;
};

export const parsePost = (content: string): Block[] => {
	const blocks: Block[] = [];
	for (const chunk of decode(content).split(/\n\s*\n/)) {
		const lines = chunk.split('\n').filter((line) => line.trim());
		if (!lines.length) continue;
		const isQuote = lines.every((line) => line.startsWith('>'));
		blocks.push({
			type: isQuote ? 'quote' : 'paragraph',
			lines: lines.map((line) => parseInline(isQuote ? line.replace(/^>\s*/, '') : line))
		});
	}
	return blocks;
};
