"use client";

import { useState } from "react";
import { createChore } from "@/lib/api/choreApi";

type Props = {
    onCreated?: () => void;
};

export default function ChoreForm({ onCreated }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState(10);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await createChore({ title, description, points });

            setTitle("");
            setDescription("");
            setPoints(10);

            // event naar parent
            if (onCreated) onCreated();

            // optioneel: cache bijwerken
            const cache = localStorage.getItem("chores_cache");
            if (cache) {
                const parsed = JSON.parse(cache);
                parsed.push({
                    id: "temp-" + Date.now(),
                    title,
                    description,
                    points,
                    done: false,
                });
                localStorage.setItem("chores_cache", JSON.stringify(parsed));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="cc-card">
            <div className="cc-card-header">
                <h3 className="cc-card-title">Nieuwe taak</h3>
                <p className="cc-card-subtitle">
                    Voeg een taak toe aan het huishouden.
                </p>
            </div>

            <div className="cc-stack">
                <div>
                    <label className="cc-label">Titel</label>
                    <input
                        className="cc-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Bijv. Afwas doen"
                    />
                </div>

                <div>
                    <label className="cc-label">Beschrijving</label>
                    <textarea
                        className="cc-textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optioneel: extra info over de taak"
                    />
                </div>

                <div>
                    <label className="cc-label">Punten</label>
                    <input
                        type="number"
                        min={1}
                        className="cc-input"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="cc-btn"
                    >
                        {loading ? "Opslaan..." : "Taak toevoegen"}
                    </button>
                </div>
            </div>
        </form>
    );
}
