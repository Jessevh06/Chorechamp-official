"use client";

import { useState } from "react";
import { createMember } from "@/lib/api/memberApi";

type Props = {
    onCreated?: () => void;
};

export default function MemberForm({ onCreated }: Props) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await createMember({ name: name.trim() });
            setName("");
            if (onCreated) onCreated();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="cc-card">
            <div className="cc-card-header">
                <h3 className="cc-card-title">Nieuw lid</h3>
                <p className="cc-card-subtitle">
                    Voeg een huisgenoot toe aan je ChoreChamp huishouden.
                </p>
            </div>

            <div className="cc-stack">
                <div>
                    <label className="cc-label">Naam</label>
                    <input
                        className="cc-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Bijv. Sarah"
                        required
                    />
                </div>

                <div>
                    <button type="submit" disabled={loading} className="cc-btn">
                        {loading ? "Toevoegen..." : "Lid toevoegen"}
                    </button>
                </div>
            </div>
        </form>
    );
}
