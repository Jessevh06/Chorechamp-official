// src/lib/api/memberApi.ts
export type Member = {
    id: string;
    name: string;
    currentPoints: number;   // beschikbare punten
    totalEarned: number;     // totaal ooit verdiend
};

const BASE_URL = "http://localhost:8080/api/members";

// ---------------------------------------------------------
// GET — alle leden ophalen
// ---------------------------------------------------------
export async function fetchMembers(): Promise<Member[]> {
    const res = await fetch(BASE_URL, { cache: "no-store" });

    if (!res.ok) {
        const error = await res.text();
        console.error("fetchMembers error:", error);
        throw new Error("Failed to fetch members");
    }

    return res.json();
}

// ---------------------------------------------------------
// POST — nieuw lid aanmaken
// ---------------------------------------------------------
export async function createMember(input: { name: string }): Promise<Member> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input.name }),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("createMember backend error:", res.status, error);
        throw new Error("Failed to create member");
    }

    return res.json();
}

// ---------------------------------------------------------
// PUT — lid bijwerken
// ---------------------------------------------------------
export async function updateMember(
    id: string,
    input: Partial<Member>
): Promise<Member> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error(`updateMember error (${id}):`, error);
        throw new Error("Failed to update member");
    }

    return res.json();
}

// ---------------------------------------------------------
// DELETE — lid verwijderen
// ---------------------------------------------------------
export async function deleteMember(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) {
        const error = await res.text();
        console.error(`deleteMember error (${id}):`, error);
        throw new Error("Failed to delete member");
    }
}

// ---------------------------------------------------------
// POST — Punten geven aan een lid
// ---------------------------------------------------------
export async function awardMemberPoints(
    id: string,
    points: number
): Promise<Member> {
    if (points < 0) {
        throw new Error("Points cannot be negative");
    }

    const res = await fetch(`${BASE_URL}/${id}/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("awardMemberPoints backend error:", res.status, error);
        throw new Error("Failed to award points");
    }

    return res.json();
}
