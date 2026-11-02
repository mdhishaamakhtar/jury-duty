import { expect, test } from '@playwright/test';

const countText = (page: import('@playwright/test').Page) =>
	page
		.getByText(/\d of 6/)
		.filter({ visible: true })
		.first();

const edge = (page: import('@playwright/test').Page, selector: string) =>
	page
		.locator(selector)
		.first()
		.evaluate((node) => Math.round(node.getBoundingClientRect().left));

test.describe('landing page', () => {
	test('lines up every section', async ({ page }) => {
		await page.goto('/');
		const left = await edge(page, 'nav');
		expect(await edge(page, '.how h2')).toBe(left);
		expect(await edge(page, '.foot')).toBe(left);
	});

	test('never scrolls sideways', async ({ page }) => {
		await page.goto('/');
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});

	test('opens and closes the guidelines', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Read the guidelines' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	test('tries a verdict in place', async ({ page }) => {
		await page.goto('/');
		const sample = page.locator('.sample');
		const first = await sample.textContent();
		await page.getByRole('button', { name: 'True', exact: true }).click();
		await expect(sample).not.toHaveText(first ?? '');
	});
});

test.describe('protected pages', () => {
	test('send logged-out visitors home', async ({ page }) => {
		await page.goto('/label');
		await expect(page).toHaveURL('/');
		await page.goto('/results');
		await expect(page).toHaveURL('/');
	});

	test('refuse logged-out verdicts and exports', async ({ request }) => {
		const verdict = await request.post('/api/verdict', {
			data: { postId: 'x', verdict: 'TRUE' },
			headers: { origin: 'http://127.0.0.1:4173' }
		});
		expect(verdict.status()).toBe(401);
		expect((await request.get('/results/verdicts.csv')).status()).toBe(404);
	});
});

test.describe('demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/demo');
		await expect(countText(page)).toContainText('0 of 6');
	});

	test('casts verdicts by button and reaches the end', async ({ page }) => {
		for (let count = 1; count <= 6; count += 1) {
			await page.getByRole('button', { name: /^True/ }).click();
			if (count < 6) await expect(countText(page)).toContainText(`${count} of 6`);
		}
		await expect(page.getByRole('heading', { name: 'That’s every post.' })).toBeVisible();
	});

	test('keeps the buttons in place for short and long posts', async ({ page }) => {
		const button = page.getByRole('button', { name: /^True/ });
		const tops = new Set<number>();
		for (let count = 0; count < 5; count += 1) {
			const box = await button.boundingBox();
			tops.add(Math.round(box?.y ?? -1));
			await button.click();
			await expect(countText(page)).toContainText(`${count + 1} of 6`);
		}
		expect(tops.size).toBe(1);
	});

	test('supports the keyboard', async ({ page, isMobile }) => {
		test.skip(isMobile, 'Phones have no keyboard');
		await page.keyboard.press('1');
		await expect(countText(page)).toContainText('1 of 6');
		await page.keyboard.press('f');
		await expect(countText(page)).toContainText('2 of 6');
		await page.keyboard.press('ArrowLeft');
		await expect(countText(page)).toContainText('3 of 6');
	});

	test('ignores browser shortcuts', async ({ page, isMobile }) => {
		test.skip(isMobile, 'Phones have no keyboard');
		await page.keyboard.press('Control+f');
		await page.keyboard.press('Meta+t');
		await page.waitForTimeout(600);
		await expect(countText(page)).toContainText('0 of 6');
	});

	test('undoes the last verdict', async ({ page }) => {
		await page.getByRole('button', { name: /^False/ }).click();
		await expect(page.getByText('Saved FALSE')).toBeVisible();
		await page.getByRole('button', { name: 'Undo' }).click();
		await expect(countText(page)).toContainText('0 of 6');
		await expect(page.getByText('Saved FALSE')).toBeHidden();
	});

	test('blocks verdict keys while the guidelines are open', async ({ page, isMobile }) => {
		test.skip(isMobile, 'Phones have no keyboard');
		await page.keyboard.press('g');
		await page.keyboard.press('1');
		await page.waitForTimeout(500);
		await page.keyboard.press('Escape');
		await expect(countText(page)).toContainText('0 of 6');
	});

	test('shows keyboard help', async ({ page, isMobile }) => {
		test.skip(isMobile, 'Phones have no keyboard');
		await page.keyboard.press('Shift+?');
		await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeHidden();
	});

	test('opens guidelines as a modal on phones', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'Desktop shows them beside the post');
		await page.getByRole('button', { name: 'Guidelines' }).filter({ visible: true }).click();
		await expect(page.getByRole('dialog', { name: 'Labeling Guidelines' })).toBeVisible();
		await page.getByRole('button', { name: 'Close', exact: true }).click();
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	test('keeps Exit demo and hides Sign out', async ({ page }) => {
		await expect(
			page.getByRole('link', { name: 'Exit demo' }).filter({ visible: true })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Sign out' })).toHaveCount(0);
	});
});
