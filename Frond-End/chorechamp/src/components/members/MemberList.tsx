"use client";

import { useEffect, useState } from "react";
import {
    Member,
    fetchMembers,
    updateMember,
    deleteMember,
    awardMemberPoints,
} from "@/lib/api/memberApi";

export default function MemberList() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [awardInputs, setAwardInputs] = useState<Record<string, number>>({});

    useEffect(() => {
        loadMembers();
    }, []);

    async function loadMembers() {
        setLoading(true);
        try {
            const data = await fetchMembers();
            setMembers(data);
            localStorage.setItem("members_cache", JSON.stringify(data));
        } catch (err) {
            console.error(err);
            const cache = localStorage.getItem("members_cache");
            if (cache) setMembers(JSON.parse(cache));
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPoints(member: Member) {
        try {
            const updated = await updateMember(member.id, {
                ...member,
                currentPoints: 0,
            });
            setMembers((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteMember(id);
            const newList = members.filter((m) => m.id !== id);
            setMembers(newList);
            localStorage.setItem("members_cache", JSON.stringify(newList));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAward(member: Member) {
        const points = awardInputs[member.id] ?? 0;
        if (!points || points === 0) return;

        try {
            const updated = await awardMemberPoints(member.id, points);
            setMembers((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
            );
            setAwardInputs((prev) => ({ ...prev, [member.id]: 0 }));
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return <p className="cc-text-muted">Leden laden...</p>;
    }

    if (members.length === 0) {
        return (
            <div className="cc-card">
                <p className="cc-text-muted">
                    Er zijn nog geen leden toegevoegd. Voeg eerst iemand toe.
                </p>
            </div>
        );
    }

    return (
        <div className="cc-stack">
            {members.map((member) => (
                <div key={member.id} className="cc-card cc-card-row">
                    <div>
                        <p className="cc-card-title" style={{ fontSize: "1rem" }}>
                            {member.name}
                        </p>
                        <p className="cc-text-muted">
                            Huidige punten: <strong>{member.currentPoints}</strong> · Totaal
                            verdiend: <strong>{member.totalEarned}</strong>
                        </p>
                    </div>
                    <div className="cc-stack" style={{ alignItems: "flex-end" }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <input
                                type="number"
                                className="cc-input"
                                style={{ width: "90px" }}
                                min={1}
                                value={awardInputs[member.id] ?? ""}
                                placeholder="+ punten"
                                onChange={(e) =>
                                    setAwardInputs((prev) => ({
                                        ...prev,
                                        [member.id]: Number(e.target.value),
                                    }))
                                }
                            />
                            <button
                                onClick={() => handleAward(member)}
                                className="cc-btn cc-btn-outline"
                            >
                                Punten geven
                            </button>
                        </div>
                        <button
                            onClick={() => handleResetPoints(member)}
                            className="cc-btn cc-btn-outline"
                        >
                            Punten resetten
                        </button>
                        <button
                            onClick={() => handleDelete(member.id)}
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
