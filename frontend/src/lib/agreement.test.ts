import { describe, expect, it } from 'vitest';
import {
	bootstrapInterval,
	cohenKappa,
	describeAgreement,
	fleissKappa,
	gwetAC1,
	krippendorffAlpha,
	pabak,
	percentAgreement,
	raterPairs,
	specificAgreement,
	summarize,
	toUnits,
	type Rating,
	type Unit
} from './agreement.ts';

const repeat = (unit: Unit, count: number) => Array.from({ length: count }, () => ({ ...unit }));

const twoRaters = (bothTrue: number, onlyA: number, onlyB: number, bothFalse: number): Unit[] => [
	...repeat({ yes: 2, no: 0 }, bothTrue),
	...repeat({ yes: 1, no: 1 }, onlyA + onlyB),
	...repeat({ yes: 0, no: 2 }, bothFalse)
];

describe('published worked examples', () => {
	it('matches Cohen’s kappa from the standard 2x2 example', () => {
		// a=20, b=5, c=10, d=15 gives po=0.7, pe=0.5, kappa=0.4.
		expect(cohenKappa(20, 5, 10, 15)).toBeCloseTo(0.4, 10);
	});

	it('matches Krippendorff’s alpha worked by hand', () => {
		// 3 of 10 units split, 5 TRUE of 20 values: 1 - 0.3 / (2 * 5 * 15 / (20 * 19)) = 0.24.
		const a = [0, 1, 0, 0, 0, 0, 0, 0, 1, 0];
		const b = [1, 1, 0, 0, 1, 0, 0, 0, 0, 0];
		const units = a.map((value, index) => ({
			yes: value + b[index],
			no: 2 - value - b[index]
		}));
		expect(krippendorffAlpha(units)).toBeCloseTo(0.24, 10);
	});

	it('shows the kappa paradox, with high agreement and low kappa', () => {
		const units = twoRaters(90, 5, 5, 0);
		expect(percentAgreement(units)).toBeCloseTo(0.9, 10);
		expect(fleissKappa(units)).toBeCloseTo(-0.0526, 3);
		expect(gwetAC1(units)).toBeCloseTo((0.9 - 0.095) / (1 - 0.095), 10);
	});
});

describe('identities', () => {
	it('gives 1 for perfect agreement', () => {
		const units = twoRaters(30, 0, 0, 30);
		expect(percentAgreement(units)).toBe(1);
		expect(krippendorffAlpha(units)).toBeCloseTo(1, 10);
		expect(fleissKappa(units)).toBeCloseTo(1, 10);
		expect(gwetAC1(units)).toBeCloseTo(1, 10);
		expect(pabak(units)).toBe(1);
	});

	it('keeps PABAK equal to 2 × agreement − 1', () => {
		expect(pabak(twoRaters(10, 5, 5, 10))).toBeCloseTo(1 / 3, 10);
	});

	it('brings alpha close to Scott’s pi with a small sample correction', () => {
		const units = twoRaters(20, 5, 10, 15);
		const n = 2 * units.length;
		const pi = fleissKappa(units) as number;
		expect(krippendorffAlpha(units)).toBeCloseTo(1 - ((1 - pi) * (n - 1)) / n, 10);
	});

	it('computes specific agreement', () => {
		const { positive, negative } = specificAgreement(twoRaters(20, 5, 10, 15));
		expect(positive).toBeCloseTo((2 * 20) / (2 * 20 + 15), 10);
		expect(negative).toBeCloseTo((2 * 15) / (2 * 15 + 15), 10);
	});

	it('returns null when a statistic is undefined', () => {
		expect(percentAgreement([])).toBeNull();
		expect(krippendorffAlpha([])).toBeNull();
		expect(cohenKappa(0, 0, 0, 0)).toBeNull();
		expect(krippendorffAlpha(repeat({ yes: 2, no: 0 }, 5))).toBeNull();
	});
});

describe('ratings', () => {
	const ratings: Rating[] = [
		{ post: '1', rater: 'a', label: 'TRUE' },
		{ post: '1', rater: 'b', label: 'TRUE' },
		{ post: '2', rater: 'a', label: 'TRUE' },
		{ post: '2', rater: 'b', label: 'FALSE' },
		{ post: '3', rater: 'b', label: 'FALSE' },
		{ post: '3', rater: 'c', label: 'FALSE' },
		{ post: '4', rater: 'c', label: 'TRUE' }
	];

	it('ignores posts with a single rating', () => {
		expect(toUnits(ratings)).toHaveLength(3);
	});

	it('builds a table for each pair of raters', () => {
		const [first] = raterPairs(ratings);
		expect(first).toMatchObject({ a: 'a', b: 'b', n: 2, bothTrue: 1, onlyA: 1, agreement: 0.5 });
	});

	it('leaves Fleiss empty when raters per post vary', () => {
		const uneven = [...ratings, { post: '1', rater: 'c', label: 'TRUE' } as Rating];
		expect(summarize(uneven).fleiss).toBeNull();
	});
});

describe('bootstrapInterval', () => {
	const units = twoRaters(40, 8, 8, 40);

	it('contains the point estimate', () => {
		const interval = bootstrapInterval(units, krippendorffAlpha);
		const point = krippendorffAlpha(units) as number;
		expect(interval?.low).toBeLessThan(point);
		expect(interval?.high).toBeGreaterThan(point);
	});

	it('is repeatable', () => {
		expect(bootstrapInterval(units, gwetAC1)).toEqual(bootstrapInterval(units, gwetAC1));
	});
});

describe('describeAgreement', () => {
	it.each([
		[-0.1, 'Worse than chance'],
		[0.1, 'Slight'],
		[0.3, 'Fair'],
		[0.5, 'Moderate'],
		[0.7, 'Substantial'],
		[0.9, 'Almost perfect'],
		[null, 'Not enough data']
	])('reads %s as %s', (value, text) => {
		expect(describeAgreement(value)).toBe(text);
	});
});
