export type Label = 'TRUE' | 'FALSE';

export interface Rating {
	post: string;
	rater: string;
	label: Label;
}

// How many raters said TRUE and FALSE on one post.
export interface Unit {
	yes: number;
	no: number;
}

export interface PairResult {
	a: string;
	b: string;
	n: number;
	agreement: number;
	kappa: number | null;
	bothTrue: number;
	bothFalse: number;
	onlyA: number;
	onlyB: number;
}

const ratio = (top: number, bottom: number) => (bottom === 0 ? null : top / bottom);

export const toUnits = (ratings: Rating[]): Unit[] => {
	const posts = new Map<string, Unit>();
	for (const { post, label } of ratings) {
		const unit = posts.get(post) ?? { yes: 0, no: 0 };
		if (label === 'TRUE') unit.yes += 1;
		else unit.no += 1;
		posts.set(post, unit);
	}
	return [...posts.values()].filter((unit) => unit.yes + unit.no >= 2);
};

const size = ({ yes, no }: Unit) => yes + no;

// The share of rater pairs on a post that agree, averaged across posts.
const unitAgreement = (unit: Unit) => {
	const m = size(unit);
	return (unit.yes * (unit.yes - 1) + unit.no * (unit.no - 1)) / (m * (m - 1));
};

export const percentAgreement = (units: Unit[]) =>
	ratio(
		units.reduce((sum, unit) => sum + unitAgreement(unit), 0),
		units.length
	);

const pooledYes = (units: Unit[]) =>
	ratio(
		units.reduce((sum, unit) => sum + unit.yes, 0),
		units.reduce((sum, unit) => sum + size(unit), 0)
	);

// Fleiss' kappa. With exactly two raters on each post this is the same value as Scott's pi.
export const fleissKappa = (units: Unit[]) => {
	const observed = percentAgreement(units);
	const yes = pooledYes(units);
	if (observed === null || yes === null) return null;
	return ratio(observed - (yes ** 2 + (1 - yes) ** 2), 1 - (yes ** 2 + (1 - yes) ** 2));
};

// Krippendorff's alpha for nominal data. It allows a different number of raters per post.
export const krippendorffAlpha = (units: Unit[]) => {
	const yes = units.reduce((sum, unit) => sum + unit.yes, 0);
	const no = units.reduce((sum, unit) => sum + unit.no, 0);
	const total = yes + no;
	if (total < 2) return null;
	const disagreement = units.reduce(
		(sum, unit) => sum + (2 * unit.yes * unit.no) / (size(unit) - 1),
		0
	);
	const expected = (2 * yes * no) / (total * (total - 1));
	const observed = disagreement / total;
	return ratio(expected - observed, expected);
};

// Gwet's AC1 stays stable when one label is far more common than the other.
export const gwetAC1 = (units: Unit[]) => {
	const observed = percentAgreement(units);
	if (observed === null) return null;
	const prevalence = units.reduce((sum, unit) => sum + unit.yes / size(unit), 0) / units.length;
	const chance = 2 * prevalence * (1 - prevalence);
	return ratio(observed - chance, 1 - chance);
};

// Prevalence and bias adjusted kappa. It assumes each label is equally likely by chance.
export const pabak = (units: Unit[]) => {
	const observed = percentAgreement(units);
	return observed === null ? null : 2 * observed - 1;
};

// Agreement on each label alone, so a high overall score can't hide weak TRUE agreement.
export const specificAgreement = (units: Unit[]) => {
	let agreeYes = 0;
	let agreeNo = 0;
	let split = 0;
	for (const unit of units) {
		const weight = 1 / (size(unit) - 1);
		agreeYes += unit.yes * (unit.yes - 1) * weight;
		agreeNo += unit.no * (unit.no - 1) * weight;
		split += 2 * unit.yes * unit.no * weight;
	}
	return {
		positive: ratio(agreeYes, agreeYes + split / 2),
		negative: ratio(agreeNo, agreeNo + split / 2)
	};
};

export const cohenKappa = (bothTrue: number, onlyA: number, onlyB: number, bothFalse: number) => {
	const n = bothTrue + onlyA + onlyB + bothFalse;
	if (n === 0) return null;
	const observed = (bothTrue + bothFalse) / n;
	const aYes = (bothTrue + onlyA) / n;
	const bYes = (bothTrue + onlyB) / n;
	const chance = aYes * bYes + (1 - aYes) * (1 - bYes);
	return ratio(observed - chance, 1 - chance);
};

export const raterPairs = (ratings: Rating[]): PairResult[] => {
	const byPost = new Map<string, Rating[]>();
	for (const rating of ratings) {
		byPost.set(rating.post, [...(byPost.get(rating.post) ?? []), rating]);
	}
	const pairs = new Map<string, PairResult>();
	for (const group of byPost.values()) {
		const sorted = [...group].sort((x, y) => x.rater.localeCompare(y.rater));
		for (let i = 0; i < sorted.length; i += 1) {
			for (let j = i + 1; j < sorted.length; j += 1) {
				const [first, second] = [sorted[i], sorted[j]];
				const key = `${first.rater}|${second.rater}`;
				const pair = pairs.get(key) ?? {
					a: first.rater,
					b: second.rater,
					n: 0,
					agreement: 0,
					kappa: null,
					bothTrue: 0,
					bothFalse: 0,
					onlyA: 0,
					onlyB: 0
				};
				pair.n += 1;
				if (first.label === 'TRUE' && second.label === 'TRUE') pair.bothTrue += 1;
				else if (first.label === 'FALSE' && second.label === 'FALSE') pair.bothFalse += 1;
				else if (first.label === 'TRUE') pair.onlyA += 1;
				else pair.onlyB += 1;
				pairs.set(key, pair);
			}
		}
	}
	return [...pairs.values()]
		.map((pair) => ({
			...pair,
			agreement: (pair.bothTrue + pair.bothFalse) / pair.n,
			kappa: cohenKappa(pair.bothTrue, pair.onlyA, pair.onlyB, pair.bothFalse)
		}))
		.sort((x, y) => y.n - x.n);
};

// A small seeded generator, so the same data always shows the same interval.
const seeded = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let mixed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
	return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
};

// A percentile bootstrap over posts. Posts are the unit that was sampled.
export const bootstrapInterval = (
	units: Unit[],
	statistic: (units: Unit[]) => number | null,
	rounds = 2000
) => {
	if (units.length < 2) return null;
	const random = seeded(20261102);
	const values: number[] = [];
	for (let round = 0; round < rounds; round += 1) {
		const sample = units.map(() => units[Math.floor(random() * units.length)]);
		const value = statistic(sample);
		if (value !== null) values.push(value);
	}
	if (!values.length) return null;
	values.sort((x, y) => x - y);
	return {
		low: values[Math.floor(values.length * 0.025)],
		high: values[Math.min(values.length - 1, Math.floor(values.length * 0.975))]
	};
};

// Landis and Koch's bands, the usual plain-language reading of kappa.
export const describeAgreement = (value: number | null) => {
	if (value === null) return 'Not enough data';
	if (value < 0) return 'Worse than chance';
	if (value <= 0.2) return 'Slight';
	if (value <= 0.4) return 'Fair';
	if (value <= 0.6) return 'Moderate';
	if (value <= 0.8) return 'Substantial';
	return 'Almost perfect';
};

export const summarize = (ratings: Rating[]) => {
	const units = toUnits(ratings);
	const lengths = new Set(units.map(size));
	return {
		posts: units.length,
		raters: new Set(ratings.map(({ rater }) => rater)).size,
		percent: percentAgreement(units),
		krippendorff: krippendorffAlpha(units),
		krippendorffInterval: bootstrapInterval(units, krippendorffAlpha),
		// Fleiss needs the same number of raters on every post.
		fleiss: lengths.size === 1 ? fleissKappa(units) : null,
		gwet: gwetAC1(units),
		gwetInterval: bootstrapInterval(units, gwetAC1),
		pabak: pabak(units),
		specific: specificAgreement(units),
		pairs: raterPairs(ratings)
	};
};
