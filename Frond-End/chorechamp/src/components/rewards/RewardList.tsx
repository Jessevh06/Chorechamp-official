"use client";

import { useEffect, useState } from "react";
import { Reward, fetchRewards, deleteReward } from "@/lib/api/rewardApi";

export default function RewardList() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        const data = await fetchRewards();
        setRewards(data);
        setLoading(false);
    }

    async function remove(id: string) {
        await deleteReward(id);
        setRewards((list) => list.filter((r) => r.id !== id));
    }

    if (loading) return <p className="cc-text-muted">Laden...</p>;

    if (rewards.length === 0)
        return (
            <div className="cc-card">
                <p className="cc-text-muted">Nog geen beloningen toegevoegd.</p>
            </div>
        );

    return (
        <div className="cc-stack">
            {rewards.map((r) => (
                <div key={r.id} className="cc-card cc-card-row">
                    <div>
                        <p className="cc-card-title">{r.name}</p>
                        <p className="cc-text-muted">{r.cost} punten</p>
                        {r.description && (
                            <p className="cc-text-muted" style={{ marginTop: ".25rem" }}>
                                {r.description}
                            </p>
                        )}
                    </div>

                    <button className="cc-btn cc-btn-outline" onClick={() => remove(r.id)}>
                        Verwijderen
                    </button>
                </div>
            ))}
        </div>
    );
}
