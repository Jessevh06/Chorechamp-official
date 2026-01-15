"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createChoreForHousehold } from "@/lib/api/choreApi";

type Props = {
    householdId: string | null;      // geef vanuit dashboard mee
    onCreated?: () => void;
};

export default function ChoreForm({ householdId, onCreated }: Props) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState<number>(10);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return !!user && !!householdId && !loading && title.trim().length > 0;
    }, [user, householdId, loading, title]);

    // CLS/stabiliteit: reset error als householdId verandert
    useEffect(() => {
        setError(null);
    }, [householdId]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!user) return;

        setError(null);

        if (!householdId) {
            setError("Je zit nog niet in een huishouden.");
            return;
        }

        const safeTitle = title.trim();
        if (!safeTitle) {
            setError("Titel is verplicht.");
            return;
        }

        setLoading(true);
        try {
            await createChoreForHousehold(householdId, {
                title: safeTitle,
                description: description.trim(),
                points,
            });

            setTitle("");
            setDescription("");
            setPoints(10);

            onCreated?.();
        } catch (err) {
            console.error(err);
            setError("Kon taak niet aanmaken.");
        } finally {
            setLoading(false);
        }
    }

    // zelfde gedrag als jij had: zonder user render je niets
    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="cc-card cc-stack" style={{ minHeight: 260 }}>
            <h2 className="cc-card-title">Taak toevoegen</h2>

            {!householdId && (
                <p className="cc-text-muted">
                    Koppel eerst een huishouden om taken te kunnen toevoegen.
                </p>
            )}

            <div>
                <label className="cc-label">Titel</label>
                <input
                    className="cc-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!householdId || loading}
                />
            </div>

            <div>
                <label className="cc-label">Omschrijving</label>
                <textarea
                    className="cc-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!householdId || loading}
                />
            </div>

            <div>
                <label className="cc-label">Punten</label>
                <input
                    className="cc-input"
                    type="number"
                    min={0}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                    disabled={!householdId || loading}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="cc-btn" disabled={!canSubmit}>
                {loading ? "Bezig..." : "Toevoegen"}
            </button>
        </form>
    );
}
