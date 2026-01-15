// src/lib/api/rewardApi.ts

export type Reward = {
    id: string;
    name: string;
    cost: number;
    description: string;
};

const API_BASE = "http://localhost:8080/api";

// ✅ Household scoped
export async function fetchRewardsForHousehold(householdId: string): Promise<Reward[]> {
    const res = await fetch(
        `${API_BASE}/households/${encodeURIComponent(householdId)}/rewards`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("fetchRewardsForHousehold error:", res.status, error);
        throw new Error("Failed to fetch rewards for household");
    }

    return res.json();
}

export async function createRewardForHousehold(
    householdId: string,
    input: { name: string; cost: number; description: string }
): Promise<Reward> {
    const res = await fetch(
        `${API_BASE}/households/${encodeURIComponent(householdId)}/rewards`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("createRewardForHousehold error:", res.status, error);
        throw new Error("Failed to create reward for household");
    }

    return res.json();
}

// global by id remains fine
export async function updateReward(id: string, input: Partial<Reward>): Promise<Reward> {
    const res = await fetch(`${API_BASE}/rewards/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("updateReward error:", res.status, error);
        throw new Error("Failed to update reward");
    }

    return res.json();
}

export async function deleteReward(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/rewards/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("deleteReward error:", res.status, error);
        throw new Error("Failed to delete reward");
    }
}
