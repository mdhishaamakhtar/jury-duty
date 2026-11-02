import { describe, expect, it } from 'vitest';
import { parsePost } from './post-text';

describe('parsePost', () => {
	it('splits paragraphs and keeps line breaks', () => {
		const blocks = parsePost('one\ntwo\n\nthree');
		expect(blocks).toHaveLength(2);
		expect(blocks[0].lines).toHaveLength(2);
	});

	it('finds quotes after decoding entities', () => {
		expect(parsePost('&gt; quoted')[0]).toEqual({
			type: 'quote',
			lines: [[{ type: 'text', text: 'quoted' }]]
		});
	});

	it('parses inline styles', () => {
		expect(parsePost('a **b** *c* ~~d~~ `e`')[0].lines[0].map((part) => part.type)).toEqual([
			'text',
			'bold',
			'text',
			'italic',
			'text',
			'strike',
			'text',
			'code'
		]);
	});

	it('keeps web links', () => {
		expect(parsePost('[site](https://example.com)')[0].lines[0][0]).toEqual({
			type: 'link',
			text: 'site',
			href: 'https://example.com'
		});
	});

	it('never turns an unsafe link into a link', () => {
		for (const href of ['javascript:alert(1)', 'data:text/html,x', 'JAVASCRIPT:alert(1)']) {
			const parts = parsePost(`[x](${href})`)[0].lines[0];
			expect(parts.every((part) => part.type === 'text')).toBe(true);
			expect(parts.map((part) => part.text).join('')).toBe(`[x](${href})`);
		}
	});
});
