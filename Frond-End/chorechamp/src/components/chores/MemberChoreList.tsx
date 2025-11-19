"use client";

import { useEffect, useState } from "react";
import { Chore, fetchChores } from "@/lib/api/choreApi";

export default function MemberChoreList() {
    const [chores, setChores] = useState<Chore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchChores();
            setChores(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p className="cc-text-muted">Taken laden...</p>;
    }

    if (chores.length === 0) {
        return <p className="cc-text-muted">Er zijn nog geen taken beschikbaar.</p>;
    }

    return (
        <div className="cc-card cc-stack">
            {chores.map((c) => (
                <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                    <div>
                        <p className="font-medium text-slate-900">{c.title}</p>
                        {c.description && (
                            <p className="cc-text-muted text-xs">{c.description}</p>
                        )}
                        <p className="cc-text-muted text-xs">
                            {c.points} punten · {c.done ? "Afgerond" : "Open"}
                        </p>
                    </div>

                    {/* hier later: knop 'Claim taak' / 'Klaar melden' */}
                </div>
            ))}
        </div>
    );
}
