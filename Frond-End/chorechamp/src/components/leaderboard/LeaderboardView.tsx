// src/components/leaderboard/LeaderboardView.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchMembers, Member } from "@/lib/api/memberApi";

export default function LeaderboardView() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        try {
            const data: Member[] = await fetchMembers();
            // sorteren op totalEarned desc
            data.sort((a: Member, b: Member) => b.totalEarned - a.totalEarned);
            setMembers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p className="cc-text-muted">Leaderboard laden...</p>;
    }

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
