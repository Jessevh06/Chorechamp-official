"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import { fetchRewardsForHousehold, type Reward } from "@/lib/api/rewardApi";

export default function RewardList() {
    const { user } = useAuth();

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const household = await fetchCurrentHousehold(user.id);
            if (!household) {
                setRewards([]);
                setError("Je zit nog niet in een huishouden.");
                return;
            }

            const data = await fetchRewardsForHousehold(household.id);
            setRewards(data);
        } catch (err) {
            console.error(err);
            setError("Kon beloningen niet laden.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    if (!user) return <p className="cc-text-muted">Log in om beloningen te zien.</p>;
    if (loading) return <p className="cc-text-muted">Beloningen laden...</p>;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;

    if (rewards.length === 0) {
        return <p className="cc-text-muted">Nog geen beloningen voor dit huishouden.</p>;
    }

    return (
        <div className="cc-stack">
            {rewards.map((r) => (
                <div key={r.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">{r.name}</p>
                            <p className="cc-text-muted text-xs">{r.description}</p>
                        </div>
                        <div className="text-sm font-semibold text-slate-700">{r.cost} pt</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
