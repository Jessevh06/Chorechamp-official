"use client";

import { useEffect, useState } from "react";
import { Reward, fetchRewardsForHousehold } from "@/lib/api/rewardApi";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";

export default function RewardShop() {
    const { user } = useAuth();

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const household = await fetchCurrentHousehold(user.id);
                if (!household) {
                    if (!cancelled) setError("Je zit nog niet in een huishouden.");
                    return;
                }

                const data = await fetchRewardsForHousehold(household.id);
                if (!cancelled) setRewards(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError("Kon beloningen niet laden.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    async function handleBuy(reward: Reward) {
        setMessage(`(Demo) Je hebt "${reward.name}" gekocht voor ${reward.cost} punten.`);
        setTimeout(() => setMessage(null), 4000);
    }

    if (!user) {
        return <p className="cc-text-muted">Log in om beloningen te bekijken.</p>;
    }

    if (loading) {
        return <p className="cc-text-muted">Beloningen laden...</p>;
    }

    if (error) {
        return <p className="cc-text-muted">{error}</p>;
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
                            <p className="cc-text-muted text-xs">Kost {reward.cost} punten</p>
                        </div>

                        <button className="cc-btn" onClick={() => handleBuy(reward)}>
                            Kopen
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
