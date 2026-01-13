"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import {
    fetchChoresForHousehold,
    claimChore,
    completeChore,
    type Chore, claimChoreByUser,
} from "@/lib/api/choreApi";
import { fetchMemberByUserId } from "@/lib/api/memberApi";

export default function MemberChoreList() {
    const { user } = useAuth();

    const [memberId, setMemberId] = useState<string | null>(null);
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
                setMemberId(null);
                setError("Je zit nog niet in een huishouden.");
                return;
            }

            const member = await fetchMemberByUserId(user.id);
            if (!member) {
                setChores([]);
                setMemberId(null);
                setError("Je hebt nog geen member-profiel in dit huishouden.");
                return;
            }

            setMemberId(member.id);

            const all = await fetchChoresForHousehold(household.id);
            setChores(all);
        } catch (err) {
            console.error(err);
            setError("Kon taken niet laden.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    async function handleClaim(choreId: string) {
        if (!memberId) return;
        setActionLoadingId(choreId);
        setError(null);
        try {
            if (!user) return;
            await claimChoreByUser(choreId, user.id);
            await load();
        } catch (err) {
            console.error(err);
            setError("Kon taak niet aannemen.");
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleRequestComplete(choreId: string) {
        setActionLoadingId(choreId);
        setError(null);
        try {
            await completeChore(choreId);
            await load();
        } catch (err) {
            console.error(err);
            setError("Kon afronding niet aanvragen.");
        } finally {
            setActionLoadingId(null);
        }
    }

    if (!user) return <p className="cc-text-muted">Log in om taken te zien.</p>;
    if (loading) return <p className="cc-text-muted">Taken laden...</p>;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;

    // open = niet done, niet pending, en niet assigned
    const openChores = chores.filter(
        (c) => !c.done && !c.pendingApproval && !c.assignedMemberId
    );

    // mine = assigned aan mij (ongeacht pending/done)
    const myChores = chores.filter((c) => c.assignedMemberId === memberId);

    return (
        <div className="cc-stack">
            <div className="cc-card cc-stack">
                <h2 className="cc-card-title">Open taken</h2>
                <p className="cc-text-muted text-sm">Kies welke taken je wilt aannemen.</p>

                {openChores.length === 0 ? (
                    <p className="cc-text-muted">Geen open taken beschikbaar.</p>
                ) : (
                    <div className="cc-stack">
                        {openChores.map((c) => (
                            <div key={c.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                                <div>
                                    <p className="font-medium text-slate-900">{c.title}</p>
                                    <p className="cc-text-muted text-xs">{c.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">{c.points} pt</p>
                                </div>

                                <button
                                    className="cc-btn"
                                    disabled={actionLoadingId === c.id}
                                    onClick={() => handleClaim(c.id)}
                                >
                                    {actionLoadingId === c.id ? "Bezig..." : "Aannemen"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="cc-card cc-stack">
                <h2 className="cc-card-title">Mijn taken</h2>
                <p className="cc-text-muted text-sm">Taken die jij hebt aangenomen.</p>

                {myChores.length === 0 ? (
                    <p className="cc-text-muted">Je hebt nog geen taken aangenomen.</p>
                ) : (
                    <div className="cc-stack">
                        {myChores.map((c) => {
                            const status = c.done
                                ? "Goedgekeurd ✅"
                                : c.pendingApproval
                                    ? "Wacht op goedkeuring ⏳"
                                    : "Bezig";

                            const canRequestComplete = !c.done && !c.pendingApproval;

                            return (
                                <div key={c.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                                    <div>
                                        <p className="font-medium text-slate-900">{c.title}</p>
                                        <p className="cc-text-muted text-xs">{c.description}</p>
                                        <p className="text-xs text-slate-500 mt-1">{c.points} pt · {status}</p>
                                    </div>

                                    {canRequestComplete ? (
                                        <button
                                            className="cc-btn"
                                            disabled={actionLoadingId === c.id}
                                            onClick={() => handleRequestComplete(c.id)}
                                        >
                                            {actionLoadingId === c.id ? "Bezig..." : "Afronden aanvragen"}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-slate-500">—</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
