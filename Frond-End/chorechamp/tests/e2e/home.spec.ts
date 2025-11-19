import { test, expect } from '@playwright/test';

test('homepage werkt', async ({ page }) => {
    await page.goto('/');

    // controleer de titel
    const titel = page.getByRole('heading', { name: /Welkom bij ChoreChamp/i });
    await expect(titel).toBeVisible();

    // eventueel extra checks:
    // const link = page.getByRole('link', { name: 'ChoreChamp' });
    // await expect(link).toBeVisible();
});
