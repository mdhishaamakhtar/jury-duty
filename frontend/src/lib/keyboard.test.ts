import { describe, expect, it } from 'vitest';
import { verdictForKey } from './keyboard';

const press = (key: string, extra = {}) => ({
	key,
	metaKey: false,
	ctrlKey: false,
	altKey: false,
	repeat: false,
	...extra
});

describe('verdictForKey', () => {
	it.each([
		['1', 'TRUE'],
		['t', 'TRUE'],
		['T', 'TRUE'],
		['ArrowLeft', 'TRUE'],
		['2', 'FALSE'],
		['f', 'FALSE'],
		['F', 'FALSE'],
		['ArrowRight', 'FALSE']
	])('maps %s to %s', (key, verdict) => {
		expect(verdictForKey(press(key))).toBe(verdict);
	});

	it.each(['metaKey', 'ctrlKey', 'altKey'])('ignores keys held with %s', (modifier) => {
		expect(verdictForKey(press('f', { [modifier]: true }))).toBeNull();
		expect(verdictForKey(press('t', { [modifier]: true }))).toBeNull();
	});

	it('ignores a held key', () => {
		expect(verdictForKey(press('1', { repeat: true }))).toBeNull();
	});

	it('ignores other keys', () => {
		expect(verdictForKey(press('x'))).toBeNull();
		expect(verdictForKey(press('Enter'))).toBeNull();
	});
});
