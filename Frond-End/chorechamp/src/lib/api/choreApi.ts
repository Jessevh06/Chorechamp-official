// src/lib/api/choreApi.ts
export type Chore = {
    id: string;
    title: string;
    description: string;
    points: number;
    done: boolean;               // definitief goedgekeurd
    pendingApproval?: boolean;   // wacht op huishofd
    assignedMemberId?: string | null;
};

const BASE_URL = "http://localhost:8080/api/chores";

export async function fetchChores(): Promise<Chore[]> {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch chores");
    return res.json();
}

export async function createChore(input: {
    title: string;
    description: string;
    points: number;
}): Promise<Chore> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: input.title,
            description: input.description,
            points: input.points,
        }),
    });
    if (!res.ok) throw new Error("Failed to create chore");
    return res.json();
}

export async function updateChore(
    id: string,
    input: Partial<Chore>
): Promise<Chore> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to update chore");
    return res.json();
}

export async function deleteChore(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete chore");
}

export async function claimChore(
    id: string,
    memberId: string
): Promise<Chore> {
    const res = await fetch(`${BASE_URL}/${id}/claim/${memberId}`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to claim chore");
    return res.json();
}

// Lid vraagt goedkeuring aan
export async function completeChore(id: string): Promise<Chore> {
    const res = await fetch(`${BASE_URL}/${id}/complete`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to request completion");
    return res.json();
}

// Huishofd keurt goed
export async function approveChore(id: string): Promise<Chore> {
    const res = await fetch(`${BASE_URL}/${id}/approve`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to approve chore");
    return res.json();
}
