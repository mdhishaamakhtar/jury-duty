import { error, redirect } from '@sveltejs/kit';
import { summarize } from '#lib/agreement.ts';
import { isOwner, projectResults } from '#lib/server/database.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await locals.getUser();
	if (!user) redirect(303, '/');
	if (!(await isOwner(user.id))) error(404, 'Not found');

	const { totals, raters, overlap, disagreements } = await projectResults();
	const names = new Map(raters.map(({ rater, email }) => [rater, email ?? 'Unknown rater']));
	const agreement = summarize(overlap);

	return {
		totals,
		disagreements,
		raters: raters.map((rater) => ({ ...rater, email: names.get(rater.rater) })),
		agreement: {
			...agreement,
			pairs: agreement.pairs.map((pair) => ({
				...pair,
				a: names.get(pair.a) ?? pair.a,
				b: names.get(pair.b) ?? pair.b
			}))
		}
	};
};
