import { error } from '@sveltejs/kit';
import { toCsvRow } from '#lib/csv.ts';
import { exportPage, isOwner } from '#lib/server/database.ts';
import type { RequestHandler } from './$types';

const PAGE_SIZE = 1000;

export const GET: RequestHandler = async ({ locals }) => {
	const user = await locals.getUser();
	if (!user || !(await isOwner(user.id))) error(404, 'Not found');

	const encoder = new TextEncoder();
	let after: string | null = null;
	const stream = new ReadableStream<Uint8Array>({
		start: (controller) =>
			controller.enqueue(
				encoder.encode(
					toCsvRow(['verdict_id', 'post_id', 'post', 'rater_id', 'label', 'labeled_at'])
				)
			),
		pull: async (controller) => {
			const rows = await exportPage(after, PAGE_SIZE);
			for (const row of rows) {
				controller.enqueue(
					encoder.encode(
						toCsvRow([row.id, row.post, row.content, row.rater, row.label, row.labeled_at])
					)
				);
			}
			after = rows.at(-1)?.id ?? null;
			if (rows.length < PAGE_SIZE) controller.close();
		}
	});

	return new Response(stream, {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': 'attachment; filename="verdicts.csv"'
		}
	});
};
