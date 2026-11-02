import { expect, test } from '@playwright/test';
import { admin, people } from './local.ts';
import { signIn } from './session.ts';

test.describe.configure({ mode: 'serial' });

const userId = async (email: string) => {
	const { data } = await admin().auth.admin.listUsers({ perPage: 1000 });
	return data.users.find((user) => user.email === email)?.id;
};

const verdicts = async (email: string) => {
	const { data } = await admin()
		.from('user_label_interaction')
		.select('dataset_id,label,status,labeled_at')
		.eq('user_id', await userId(email))
		.eq('status', 'completed');
	return data ?? [];
};

test('a rater labels posts, and each verdict is saved', async ({ page, context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.rater);
	await page.goto('/label');
	const before = (await verdicts(people.rater)).length;
	await page.getByRole('button', { name: /^True/ }).click();
	await expect(page.getByText('Saved TRUE')).toBeVisible();
	await page.getByRole('button', { name: /^False/ }).click();
	await expect(page.getByText('Saved FALSE')).toBeVisible();
	const saved = await verdicts(people.rater);
	expect(saved).toHaveLength(before + 2);
	expect(
		saved
			.map(({ label }) => label)
			.sort()
			.slice(-2)
	).toContain('FALSE');
	expect(saved.every(({ labeled_at }) => labeled_at)).toBe(true);
});

test('reloading keeps the same open post', async ({ page, context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.rater);
	await page.goto('/label');
	const text = await page.locator('.post').textContent();
	await page.reload();
	await expect(page.locator('.post')).toHaveText(text ?? '');
});

test('undo removes the saved verdict and returns the post', async ({ page, context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.rater);
	await page.goto('/label');
	const text = await page.locator('.post').textContent();
	const before = (await verdicts(people.rater)).length;
	await page.getByRole('button', { name: /^True/ }).click();
	await expect(page.getByText('Saved TRUE')).toBeVisible();
	await page.getByRole('button', { name: 'Undo' }).click();
	await expect(page.locator('.post')).toHaveText(text ?? '');
	expect(await verdicts(people.rater)).toHaveLength(before);
});

test('a failed save keeps the post and retries it', async ({ page, context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.rater);
	await page.goto('/label');
	const before = (await verdicts(people.rater)).length;
	await page.route('**/api/verdict', (route) => route.abort());
	await page.getByRole('button', { name: /^False/ }).click();
	await expect(page.getByRole('alert')).toContainText('didn’t save');
	expect(await verdicts(people.rater)).toHaveLength(before);
	await page.unroute('**/api/verdict');
	await page.getByRole('button', { name: 'Try again' }).click();
	await expect(page.getByText('Saved FALSE')).toBeVisible();
	expect(await verdicts(people.rater)).toHaveLength(before + 1);
});

test('non-owners get no results page', async ({ page, context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.rater);
	await page.goto('/label');
	await expect(page.getByRole('link', { name: 'Results' })).toHaveCount(0);
	expect((await page.goto('/results'))?.status()).toBe(404);
	expect((await page.goto('/results/verdicts.csv').catch(() => null))?.status()).toBe(404);
});

test('owners can label and see results', async ({ page, context }) => {
	await signIn(context, people.owner);
	await page.goto('/label');
	await page.getByRole('link', { name: 'Results' }).filter({ visible: true }).click();
	await expect(page.getByRole('heading', { name: 'Inter-rater agreement' })).toBeVisible();
	await expect(page.getByText('Krippendorff’s α')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Rater pairs' })).toBeVisible();
	const left = (selector: string) =>
		page
			.locator(selector)
			.first()
			.evaluate((node) => Math.round(node.getBoundingClientRect().left));
	expect(await left('main h2')).toBe(await left('header h1'));
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test('owners can download every verdict', async ({ context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.owner);
	const response = await context.request.get('/results/verdicts.csv');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toContain('text/csv');
	const { count } = await admin()
		.from('user_label_interaction')
		.select('*', { count: 'exact', head: true })
		.eq('status', 'completed');
	const { parseCsv } = await import('../src/lib/csv.ts');
	expect(parseCsv(await response.text())).toHaveLength((count ?? 0) + 1);
});

test('sign out ends the session', async ({ page, context, isMobile }) => {
	test.skip(isMobile, 'Covered on desktop');
	await signIn(context, people.rater);
	await page.goto('/label');
	await page.getByRole('button', { name: 'Sign out' }).filter({ visible: true }).click();
	await expect(page).toHaveURL('/');
	await page.goto('/label');
	await expect(page).toHaveURL('/');
});
