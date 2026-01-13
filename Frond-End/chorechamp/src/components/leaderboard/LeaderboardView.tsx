"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import { fetchMembersForHousehold, type Member } from "@/lib/api/memberApi";

export default function LeaderboardView() {
    const { user, isReady } = useAuth();

    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            // ✅ wacht tot auth klaar is
            if (!isReady) {
                setLoading(true);
                return;
            }

            // ✅ auth is klaar, maar niet ingelogd
            if (!user) {
                setMembers([]);
                setError(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const household = await fetchCurrentHousehold(user.id);
                if (!household) {
                    if (!cancelled) {
                        setMembers([]);
                        setError("Je zit nog niet in een huishouden.");
                        setLoading(false);
                    }
                    return;
                }

                const data = await fetchMembersForHousehold(household.id);
                data.sort((a, b) => (b.totalEarned ?? 0) - (a.totalEarned ?? 0));

                if (!cancelled) {
                    setMembers(data);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) setError("Kon leaderboard niet laden.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [user?.id, isReady]);

    if (loading) return <p className="cc-text-muted">Leaderboard laden...</p>;
    if (!isReady) return <p className="cc-text-muted">Bezig met laden...</p>;
    if (!user) return <p className="cc-text-muted">Log in om het leaderboard te zien.</p>;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;

    if (members.length === 0) {
        return <p className="cc-text-muted">Er zijn nog geen leden met punten.</p>;
    }

    return (
        <div className="cc-card">
            <div className="cc-stack">
                {members.map((m, index) => (
                    <div
                        key={m.id}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 text-center text-sm font-semibold text-slate-500">
                                #{index + 1}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{m.name}</p>
                                <p className="cc-text-muted text-xs">
                                    {m.totalEarned} totaal · {m.currentPoints} beschikbaar
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
