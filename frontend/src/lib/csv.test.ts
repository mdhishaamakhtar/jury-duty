import { describe, expect, it } from 'vitest';
import { parseCsv, toCsvRow } from './csv.ts';

describe('toCsvRow', () => {
	it('quotes commas, quotes and new lines', () => {
		expect(toCsvRow(['a,b', 'say "hi"', 'x\ny'])).toBe('"a,b","say ""hi""","x\ny"\r\n');
	});

	it('leaves empty values blank', () => {
		expect(toCsvRow([null, undefined, 0])).toBe(',,0\r\n');
	});

	it('neutralises spreadsheet formulas', () => {
		expect(toCsvRow(['=1+1', '@x'])).toBe("'=1+1,'@x\r\n");
	});
});

describe('parseCsv', () => {
	it('reads quoted fields across lines', () => {
		expect(parseCsv('content\r\n"one, two"\n"line\nbreak ""q"""\n')).toEqual([
			['content'],
			['one, two'],
			['line\nbreak "q"']
		]);
	});

	it('round trips what it writes', () => {
		const value = 'He said, "stop"\nthen left';
		expect(parseCsv(toCsvRow([value, 'b']))).toEqual([[value, 'b']]);
	});

	it('skips blank lines', () => {
		expect(parseCsv('a\n\n  \nb')).toEqual([['a'], ['b']]);
	});
});
