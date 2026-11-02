import { admin, people, password } from './local.ts';

export default async function setup() {
	const database = admin();

	const { count } = await database.from('dataset').select('*', { count: 'exact', head: true });
	if (!count) {
		const posts = Array.from({ length: 60 }, (_, index) => ({
			id: crypto.randomUUID(),
			content: `Synthetic post number ${index + 1}`
		}));
		const { error } = await database.from('dataset').insert(posts);
		if (error) throw error;
	}

	const { data, error: listError } = await database.auth.admin.listUsers({ perPage: 1000 });
	if (listError) throw listError;

	const ids = new Map<string, string>();
	for (const email of Object.values(people)) {
		const existing = data.users.find((user) => user.email === email);
		if (existing) await database.auth.admin.deleteUser(existing.id);
		const { data: created, error } = await database.auth.admin.createUser({
			email,
			password,
			email_confirm: true
		});
		if (error) throw error;
		ids.set(email, created.user.id);
	}

	// A few posts judged by two raters, so the results page has agreement to show.
	const { data: shared, error: sharedError } = await database.from('dataset').select('id').limit(4);
	if (sharedError) throw sharedError;
	const verdicts = (shared ?? []).flatMap(({ id }, index) => [
		{ user_id: ids.get(people.owner), dataset_id: id, status: 'completed', label: 'TRUE' },
		{
			user_id: ids.get(people.outsider),
			dataset_id: id,
			status: 'completed',
			label: index % 2 ? 'FALSE' : 'TRUE'
		}
	]);
	const { error: verdictError } = await database.from('user_label_interaction').insert(verdicts);
	if (verdictError) throw verdictError;

	const { error } = await database
		.from('project_owners')
		.insert({ user_id: ids.get(people.owner) });
	if (error) throw error;
}
