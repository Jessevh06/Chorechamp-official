"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import { createChoreForHousehold } from "@/lib/api/choreApi";

export default function ChoreForm({ onCreated }: { onCreated?: () => void }) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState<number>(10);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const household = await fetchCurrentHousehold(user.id);
            if (!household) {
                setError("Je zit nog niet in een huishouden.");
                return;
            }

            await createChoreForHousehold(household.id, { title, description, points });

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

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="cc-card cc-stack">
            <h2 className="cc-card-title">Taak toevoegen</h2>

            <div>
                <label className="cc-label">Titel</label>
                <input className="cc-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
                <label className="cc-label">Omschrijving</label>
                <textarea className="cc-input" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="cc-btn" disabled={loading}>
                {loading ? "Bezig..." : "Toevoegen"}
            </button>
        </form>
    );
}
