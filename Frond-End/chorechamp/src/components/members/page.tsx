"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

import {
    Member,
    fetchMembersForHousehold,
    createMemberForHousehold,
    deleteMember,
} from "@/lib/api/memberApi";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import type { HouseholdDto } from "@/lib/types/household";

export default function MembersPage() {
    const { user } = useAuth();

    const [household, setHousehold] = useState<HouseholdDto | null>(null);
    const [householdLoading, setHouseholdLoading] = useState(false);
    const [householdError, setHouseholdError] = useState<string | null>(null);

    const [members, setMembers] = useState<Member[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState<string | null>(null);

    const [newName, setNewName] = useState("");
    const [newAvatarColor, setNewAvatarColor] = useState("#22c55e");
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

    const userId = user?.id ?? "";

    // 1) Huishouden van ingelogde user ophalen
    useEffect(() => {
        let cancelled = false;

        async function loadHousehold() {
            if (!userId) return;

            setHouseholdLoading(true);
            setHouseholdError(null);

            try {
                const h = await fetchCurrentHousehold(userId);
                if (!cancelled) {
                    setHousehold(h);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setHouseholdError("Kon je huishouden niet laden.");
                }
            } finally {
                if (!cancelled) {
                    setHouseholdLoading(false);
                }
            }
        }

        loadHousehold();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    // 2) Members ophalen zodra we een household hebben
    useEffect(() => {
        let cancelled = false;

        async function loadMembers() {
            if (!household) return;

            setMembersLoading(true);
            setMembersError(null);

            try {
                const data = await fetchMembersForHousehold(household.id);
                if (!cancelled) {
                    setMembers(data);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setMembersError("Kon de leden van dit huishouden niet laden.");
                }
            } finally {
                if (!cancelled) {
                    setMembersLoading(false);
                }
            }
        }

        loadMembers();

        return () => {
            cancelled = true;
        };
    }, [household]);

    // 3) Handlers

    async function handleCreateMember(e: FormEvent) {
        e.preventDefault();
        if (!household) return;

        setCreateError(null);
        setCreateLoading(true);

        try {
            const created = await createMemberForHousehold(household.id, {
                name: newName,
                avatarColor: newAvatarColor || undefined,
            });

            setMembers((prev) => [...prev, created]);
            setNewName("");
        } catch (err) {
            console.error(err);
            setCreateError("Lid aanmaken is mislukt. Probeer opnieuw.");
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleDeleteMember(id: string) {
        if (!confirm("Weet je zeker dat je dit lid wilt verwijderen?")) return;

        setDeleteLoadingId(id);
        try {
            await deleteMember(id);
            setMembers((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error(err);
            alert("Verwijderen is mislukt. Probeer opnieuw.");
        } finally {
            setDeleteLoadingId(null);
        }
    }

    // ---------- RENDER LOGICA ----------

    // Niet ingelogd
    if (!user) {
        return (
            <main className="cc-page cc-stack">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Leden beheren</h1>
                    <p className="cc-text-muted">
                        Je moet ingelogd zijn om de leden van je huishouden te beheren.
                    </p>
                    <Link href="/login" className="cc-btn w-fit">
                        Naar inloggen
                    </Link>
                </div>
            </main>
        );
    }

    // Huishouden aan het laden
    if (householdLoading && !household && !householdError) {
        return (
            <main className="cc-page cc-stack">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Leden beheren</h1>
                    <p className="cc-text-muted">Je huishouden wordt geladen…</p>
                </div>
            </main>
        );
    }

    // Geen huishouden
    if (!household && !householdLoading) {
        return (
            <main className="cc-page cc-stack">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Leden beheren</h1>
                    {householdError ? (
                        <p className="cc-text-muted">{householdError}</p>
                    ) : (
                        <p className="cc-text-muted">
                            Je zit nog in geen huishouden. Maak er eerst één aan of join
                            er één.
                        </p>
                    )}
                    <Link href="/household/start" className="cc-btn w-fit">
                        Koppel aan een huishouden
                    </Link>
                </div>
            </main>
        );
    }

    // Normale state: user + household
    return (
        <main className="cc-page cc-stack">
            <section className="cc-card cc-stack">
                <h1 className="cc-card-title">Leden van {household?.name}</h1>
                <p className="cc-text-muted">
                    Hier beheer je alle profielen (leden) binnen dit huishouden.
                </p>
            </section>

            <section className="cc-grid-2">
                {/* Ledenlijst */}
                <div className="cc-card cc-stack">
                    <h2 className="cc-card-title">Overzicht</h2>

                    {membersLoading && !members.length ? (
                        <p className="cc-text-muted">Leden laden…</p>
                    ) : membersError ? (
                        <p className="text-red-500 text-sm">{membersError}</p>
                    ) : members.length === 0 ? (
                        <p className="cc-text-muted">
                            Er zijn nog geen leden in dit huishouden.
                        </p>
                    ) : (
                        <table className="w-full text-sm border-collapse mt-2">
                            <thead className="text-left text-slate-200 border-b border-slate-700/60">
                            <tr>
                                <th className="py-2 pr-2">Naam</th>
                                <th className="py-2 pr-2">Punten</th>
                                <th className="py-2 pr-2">Totaal verdiend</th>
                                <th className="py-2 pr-2 text-right">Acties</th>
                            </tr>
                            </thead>
                            <tbody>
                            {members.map((m) => (
                                <tr key={m.id} className="border-b border-slate-800/60">
                                    <td className="py-2 pr-2">{m.name}</td>
                                    <td className="py-2 pr-2">{m.currentPoints}</td>
                                    <td className="py-2 pr-2">{m.totalEarnedPoints}</td>
                                    <td className="py-2 pl-2 text-right">
                                        <button
                                            className="cc-link text-xs"
                                            onClick={() => handleDeleteMember(m.id)}
                                            disabled={deleteLoadingId === m.id}
                                        >
                                            {deleteLoadingId === m.id
                                                ? "Bezig..."
                                                : "Verwijderen"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Nieuw lid aanmaken */}
                <div className="cc-card cc-stack">
                    <h2 className="cc-card-title">Nieuw lid toevoegen</h2>
                    <p className="cc-text-muted">
                        Maak een profiel aan voor een gezinslid. Je kunt later via taken
                        punten toekennen.
                    </p>

                    <form onSubmit={handleCreateMember} className="cc-stack mt-2">
                        <div className="cc-stack">
                            <label className="cc-label" htmlFor="member-name">
                                Naam
                            </label>
                            <input
                                id="member-name"
                                className="cc-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Bijv. Sam"
                                required
                            />
                        </div>

                        <div className="cc-stack">
                            <label className="cc-label" htmlFor="member-color">
                                Avatar kleur (optioneel)
                            </label>
                            <input
                                id="member-color"
                                className="cc-input"
                                type="text"
                                value={newAvatarColor}
                                onChange={(e) => setNewAvatarColor(e.target.value)}
                                placeholder="#22c55e"
                            />
                            <p className="cc-text-muted text-xs">
                                Gebruik een hex kleurcode zoals <code>#22c55e</code>.
                            </p>
                        </div>

                        {createError && (
                            <p className="text-red-500 text-sm">{createError}</p>
                        )}

                        <button className="cc-btn w-fit" disabled={createLoading}>
                            {createLoading ? "Bezig..." : "Lid toevoegen"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
