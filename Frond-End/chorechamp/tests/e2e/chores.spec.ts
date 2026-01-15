import {test, expect, APIRequestContext} from "@playwright/test";
import { loginAsAdmin } from "./_helpers";



const BACKEND = process.env.E2E_BACKEND_URL ?? "http://localhost:8080";

function uniq(prefix: string) {
    return `${prefix}-${Date.now()}`;
}

async function apiCreateChore(request: APIRequestContext, payload: { title: string; description?: string; points: number }) {
    const res = await request.post(`${BACKEND}/api/chores`, { data: payload });
    expect(res.ok()).toBeTruthy();
    return await res.json();
}

async function apiFetchChores(request: APIRequestContext) {
    const res = await request.get(`${BACKEND}/api/chores`);
    expect(res.ok()).toBeTruthy();
    return await res.json();
}

async function apiDeleteChore(request: APIRequestContext, id: string) {
    const res = await request.delete(`${BACKEND}/api/chores/${id}`);
    expect(res.ok()).toBeTruthy();
}

test("E2E-1: Admin kan naar /chores en ziet titel + form", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/chores");

    await expect(page.getByRole("heading", { name: "Taken beheren" })).toBeVisible();
    await expect(page.getByText("Nieuwe taak")).toBeVisible();
    await expect(page.getByRole("button", { name: "Taak toevoegen" })).toBeVisible();
});

test("E2E-2: Chore aanmaken via UI werkt (en verschijnt na reload)", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/chores");

    const title = uniq("Afwas");
    const description = "E2E test chore";
    const points = 12;

    await page.getByLabel("Titel").fill(title);
    await page.getByLabel("Beschrijving").fill(description);
    await page.getByLabel("Punten").fill(String(points));

    await page.getByRole("button", { name: "Taak toevoegen" }).click();

    // Omdat ChoreList niet automatisch herlaadt na create: reload voor stabiliteit
    await page.reload();

    // In de lijst staat: "{title} · {points} punten"
    await expect(page.getByText(new RegExp(`${title} .* ${points} punten`))).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
    await expect(page.getByText(/Status:\s*Open/)).toBeVisible();
});

test("E2E-3: Lege lijst toont 'Er zijn nog geen taken...' (via cleanup)", async ({ page, request }) => {
    // Maak schoon: delete alles
    const chores = await apiFetchChores(request);
    for (const c of chores) {
        await apiDeleteChore(request, c.id);
    }

    await loginAsAdmin(page);
    await page.goto("/chores");

    await expect(page.getByText(/Er zijn nog geen taken aangemaakt/i)).toBeVisible();
});

test("E2E-4: PendingApproval chore toont knop 'Goedkeuren' en na click verdwijnt pending status", async ({ page, request }) => {
    // We creëren testdata via API. Daarna moeten we hem in pendingApproval krijgen.
    // Jij hebt endpoint: POST /api/chores/{id}/complete => pendingApproval=true
    const title = uniq("Stofzuigen");
    const created = await apiCreateChore(request, { title, description: "E2E approve", points: 5 });

    const completeRes = await request.post(`${BACKEND}/api/chores/${created.id}/complete`);
    expect(completeRes.ok()).toBeTruthy();

    await loginAsAdmin(page);
    await page.goto("/chores");

    // PendingApproval status zichtbaar:
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(/Status:\s*Wacht op goedkeuring/)).toBeVisible();

    // Goedkeuren button bestaat bij pendingApproval
    await page.getByRole("button", { name: "Goedkeuren" }).click();

    // Na approve: done=true en pendingApproval=false => status "Afgerond (goedgekeurd)"
    await expect(page.getByText(/Status:\s*Afgerond \(goedgekeurd\)/)).toBeVisible();
});

test("E2E-5: Verwijderen knop verwijdert chore uit de UI", async ({ page, request }) => {
    const title = uniq("Vuilnis");
    const created = await apiCreateChore(request, { title, description: "E2E delete", points: 3 });

    await loginAsAdmin(page);
    await page.goto("/chores");

    await expect(page.getByText(title)).toBeVisible();

    // Klik de "Verwijderen" knop in dezelfde card.
    // Omdat er meerdere "Verwijderen" kunnen zijn: scope op de card met de title
    const card = page.locator(".cc-card-row", { hasText: title });
    await card.getByRole("button", { name: "Verwijderen" }).click();

    await expect(page.getByText(title)).not.toBeVisible();
});
