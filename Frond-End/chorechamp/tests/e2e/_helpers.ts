import { expect, Page } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
    await page.goto("/login");

    await page.getByLabel("Email of gebruikersnaam").fill("admin");
    await page.getByLabel("Wachtwoord").fill("admin"); // <-- let op: in jouw error stond admin123

    // Klik specifiek de submit button binnen het form
    await page.locator("form").getByRole("button", { name: "Inloggen" }).click();

    await expect(page).toHaveURL("/");
}

