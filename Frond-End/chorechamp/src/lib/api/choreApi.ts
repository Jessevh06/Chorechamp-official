// src/lib/api/choreApi.ts

export type Chore = {
    id: string;
    title: string;
    description: string;
    points: number;
    done: boolean; // definitief goedgekeurd
    pendingApproval?: boolean; // wacht op huishofd
    assignedMemberId?: string | null;
};

const API_BASE = "http://localhost:8080/api";

// ✅ Household scoped
export async function fetchChoresForHousehold(householdId: string): Promise<Chore[]> {
    const res = await fetch(
        `${API_BASE}/households/${encodeURIComponent(householdId)}/chores`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("fetchChoresForHousehold error:", res.status, error);
        throw new Error("Failed to fetch chores for household");
    }

    return res.json();
}

export async function createChoreForHousehold(
    householdId: string,
    input: { title: string; description: string; points: number }
): Promise<Chore> {
    const res = await fetch(
        `${API_BASE}/households/${encodeURIComponent(householdId)}/chores`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("createChoreForHousehold error:", res.status, error);
        throw new Error("Failed to create chore for household");
    }

    return res.json();
}

// These remain global by id (fine)
export async function updateChore(id: string, input: Partial<Chore>): Promise<Chore> {
    const res = await fetch(`${API_BASE}/chores/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("updateChore error:", res.status, error);
        throw new Error("Failed to update chore");
    }

    return res.json();
}

export async function deleteChore(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/chores/${encodeURIComponent(id)}`, { method: "DELETE" });

    if (!res.ok) {
        const error = await res.text();
        console.error("deleteChore error:", res.status, error);
        throw new Error("Failed to delete chore");
    }
}

export async function claimChore(id: string, memberId: string): Promise<Chore> {
    const res = await fetch(
        `${API_BASE}/chores/${encodeURIComponent(id)}/claim/${encodeURIComponent(memberId)}`,
        { method: "POST" }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("claimChore error:", res.status, error);
        throw new Error("Failed to claim chore");
    }

    return res.json();
}

export async function completeChore(id: string): Promise<Chore> {
    const res = await fetch(`${API_BASE}/chores/${encodeURIComponent(id)}/complete`, {
        method: "POST",
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("completeChore error:", res.status, error);
        throw new Error("Failed to request completion");
    }

    return res.json();
}

export async function approveChore(id: string): Promise<Chore> {
    const res = await fetch(`${API_BASE}/chores/${encodeURIComponent(id)}/approve`, {
        method: "POST",
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("approveChore error:", res.status, error);
        throw new Error("Failed to approve chore");
    }

    return res.json();
}
export async function claimChoreByUser(id: string, userId: string): Promise<Chore> {
    const res = await fetch(
        `${API_BASE}/chores/${encodeURIComponent(id)}/claim-by-user/${encodeURIComponent(userId)}`,
        { method: "POST" }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("claimChoreByUser error:", res.status, error);
        throw new Error("Failed to claim chore by user");
    }

    return res.json();
}

