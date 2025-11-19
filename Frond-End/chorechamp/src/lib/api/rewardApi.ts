// src/lib/api/rewardApi.ts
export type Reward = {
    id: string;
    name: string;
    cost: number;
    description: string;
};

const BASE_URL = "http://localhost:8080/api/rewards";

export async function fetchRewards(): Promise<Reward[]> {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch rewards");
    return res.json();
}

export async function createReward(input: {
    name: string;
    cost: number;
    description: string;
}): Promise<Reward> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error("Failed to create reward");
    return res.json();
}

export async function updateReward(
    id: string,
    input: Partial<Reward>
): Promise<Reward> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to update reward");
    return res.json();
}

export async function deleteReward(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete reward");
}
