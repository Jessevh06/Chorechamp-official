import { test, expect } from '@playwright/test';

test('homepage werkt', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/chorechamp/i)).toBeVisible();
});
