"use client";

import { useEffect, useState } from "react";
import { Reward, fetchRewards } from "@/lib/api/rewardApi";
// evt. later: import { useAuth } from "@/lib/auth/AuthContext";

export default function RewardShop() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchRewards();
            setRewards(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleBuy(reward: Reward) {
        // TODO: backend endpoint om punten af te trekken & aankoop op te slaan
        // Voor nu alleen een melding:
        setMessage(`(Demo) Je hebt "${reward.name}" gekocht voor ${reward.cost} punten.`);
        setTimeout(() => setMessage(null), 4000);
    }

    if (loading) {
        return <p className="cc-text-muted">Beloningen laden...</p>;
    }

    if (rewards.length === 0) {
        return <p className="cc-text-muted">Er zijn nog geen beloningen ingesteld.</p>;
    }

    return (
        <div className="cc-stack">
            {message && (
                <div className="cc-card bg-emerald-50 text-emerald-900 text-sm">
                    {message}
                </div>
            )}

            <div className="cc-card cc-stack">
                {rewards.map((reward) => (
                    <div
                        key={reward.id}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                    >
                        <div>
                            <p className="font-medium text-slate-900">{reward.name}</p>
                            {reward.description && (
                                <p className="cc-text-muted text-xs">{reward.description}</p>
                            )}
                            <p className="cc-text-muted text-xs">
                                Kost {reward.cost} punten
                            </p>
                        </div>

                        <button
                            className="cc-btn"
                            onClick={() => handleBuy(reward)}
                        >
                            Kopen
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
