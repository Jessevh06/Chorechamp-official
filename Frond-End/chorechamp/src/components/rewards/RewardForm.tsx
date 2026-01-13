"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import { createRewardForHousehold } from "@/lib/api/rewardApi";

export default function RewardForm({ onCreated }: { onCreated?: () => void }) {
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [cost, setCost] = useState<number>(10);
    const [description, setDescription] = useState("");

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

            await createRewardForHousehold(household.id, { name, cost, description });

            setName("");
            setCost(10);
            setDescription("");

            onCreated?.();
        } catch (err) {
            console.error(err);
            setError("Kon beloning niet aanmaken.");
        } finally {
            setLoading(false);
        }
    }

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="cc-card cc-stack">
            <h2 className="cc-card-title">Beloning toevoegen</h2>

            <div>
                <label className="cc-label">Naam</label>
                <input className="cc-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
                <label className="cc-label">Kosten (punten)</label>
                <input
                    className="cc-input"
                    type="number"
                    min={0}
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    required
                />
            </div>

            <div>
                <label className="cc-label">Omschrijving</label>
                <textarea className="cc-input" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="cc-btn" disabled={loading}>
                {loading ? "Bezig..." : "Toevoegen"}
            </button>
        </form>
    );
}
