"use client";

import { useState } from "react";
import { createReward } from "@/lib/api/rewardApi";

export default function RewardForm({ onCreated }: { onCreated?: () => void }) {
    const [name, setName] = useState("");
    const [cost, setCost] = useState(10);
    const [description, setDescription] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await createReward({ name, cost, description });
        setName("");
        setCost(10);
        setDescription("");
        if (onCreated) onCreated();
    }

    return (
        <form onSubmit={handleSubmit} className="cc-card cc-stack">
            <div className="cc-card-header">
                <h3 className="cc-card-title">Nieuwe beloning</h3>
                <p className="cc-card-subtitle">Maak een beloning voor leden.</p>
            </div>

            <div>
                <label className="cc-label">Naam</label>
                <input className="cc-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <label className="cc-label">Puntenkosten</label>
                <input
                    type="number"
                    className="cc-input"
                    value={cost}
                    min={1}
                    onChange={(e) => setCost(Number(e.target.value))}
                />
            </div>

            <div>
                <label className="cc-label">Beschrijving</label>
                <textarea
                    className="cc-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button className="cc-btn">Toevoegen</button>
        </form>
    );
}
