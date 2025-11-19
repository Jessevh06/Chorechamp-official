"use client";

import { useEffect, useState } from "react";
import {
    Chore,
    fetchChores,
    deleteChore,
    approveChore,
} from "@/lib/api/choreApi";

export default function ChoreList() {
    const [chores, setChores] = useState<Chore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChores();
    }, []);

    async function loadChores() {
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

    async function handleApprove(chore: Chore) {
        try {
            const updated = await approveChore(chore.id);
            setChores((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteChore(id);
            setChores((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    function renderStatus(chore: Chore) {
        if (chore.done) {
            return "Afgerond (goedgekeurd)";
        }
        if (chore.pendingApproval) {
            return "Wacht op goedkeuring";
        }
        if (chore.assignedMemberId) {
            return "Toegewezen aan lid";
        }
        return "Open";
    }

    if (loading) {
        return <p className="cc-text-muted">Taken laden...</p>;
    }

    if (chores.length === 0) {
        return (
            <div className="cc-card">
                <p className="cc-text-muted">
                    Er zijn nog geen taken aangemaakt. Voeg er eerst een toe.
                </p>
            </div>
        );
    }

    return (
        <div className="cc-stack">
            {chores.map((chore) => (
                <div key={chore.id} className="cc-card cc-card-row">
                    <div>
                        <p
                            className={
                                "cc-card-title" +
                                (chore.done ? " cc-text-done" : "")
                            }
                            style={{ fontSize: "1rem" }}
                        >
                            {chore.title} · {chore.points} punten
                        </p>
                        {chore.description && (
                            <p className="cc-text-muted">{chore.description}</p>
                        )}
                        <p className="cc-text-muted" style={{ marginTop: ".25rem" }}>
                            Status: <strong>{renderStatus(chore)}</strong>
                        </p>
                    </div>

                    <div className="cc-stack" style={{ alignItems: "flex-end" }}>
                        {chore.pendingApproval && !chore.done && (
                            <button
                                onClick={() => handleApprove(chore)}
                                className="cc-btn"
                            >
                                Goedkeuren
                            </button>
                        )}

                        <button
                            onClick={() => handleDelete(chore.id)}
                            className="cc-btn cc-btn-outline"
                        >
                            Verwijderen
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
