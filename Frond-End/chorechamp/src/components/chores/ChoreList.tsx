"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import {
    approveChore,
    fetchChoresForHousehold,
    type Chore,
} from "@/lib/api/choreApi";

export default function ChoreList() {
    const { user } = useAuth();

    const [chores, setChores] = useState<Chore[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const household = await fetchCurrentHousehold(user.id);
            if (!household) {
                setChores([]);
                setError("Je zit nog niet in een huishouden.");
                return;
            }

            const data = await fetchChoresForHousehold(household.id);
            setChores(data);
        } catch (e) {
            console.error(e);
            setError("Kon taken niet laden.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    async function handleApprove(choreId: string) {
        setActionLoadingId(choreId);
        setError(null);
        try {
            await approveChore(choreId);
            await load(); // ✅ herladen zodat status meteen klopt
        } catch (e) {
            console.error(e);
            setError("Goedkeuren mislukt.");
        } finally {
            setActionLoadingId(null);
        }
    }

    if (!user) return <p className="cc-text-muted">Log in om taken te beheren.</p>;
    if (loading) return <p className="cc-text-muted">Taken laden...</p>;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;

    if (chores.length === 0) {
        return <p className="cc-text-muted">Nog geen taken in dit huishouden.</p>;
    }

    // handig: pending eerst
    const sorted = [...chores].sort((a, b) => {
        const ap = a.pendingApproval ? 0 : 1;
        const bp = b.pendingApproval ? 0 : 1;
        return ap - bp;
    });

    return (
        <div className="cc-stack">
            {sorted.map((c) => {
                const status = c.done
                    ? "Goedgekeurd ✅"
                    : c.pendingApproval
                        ? "Wacht op goedkeuring ⏳"
                        : "Open";

                const canApprove = c.pendingApproval && !c.done;

                return (
                    <div
                        key={c.id}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                    >
                        <div>
                            <p className="font-medium text-slate-900">{c.title}</p>
                            <p className="cc-text-muted text-xs">{c.description}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {c.points} pt · Status: {status}
                            </p>
                        </div>

                        {canApprove ? (
                            <button
                                className="cc-btn"
                                disabled={actionLoadingId === c.id}
                                onClick={() => handleApprove(c.id)}
                            >
                                {actionLoadingId === c.id ? "Bezig..." : "Goedkeuren"}
                            </button>
                        ) : (
                            <span className="text-xs text-slate-500">—</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
