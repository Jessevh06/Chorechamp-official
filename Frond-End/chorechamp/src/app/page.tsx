"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

import { fetchChoresForHousehold, type Chore } from "@/lib/api/choreApi";
import { fetchMembersForHousehold, type Member } from "@/lib/api/memberApi";
import { fetchRewardsForHousehold, type Reward } from "@/lib/api/rewardApi";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";

import type { HouseholdDto } from "@/lib/types/household";

export default function DashboardPage() {
    const { user } = useAuth();

    const [household, setHousehold] = useState<HouseholdDto | null>(null);
    const [householdLoading, setHouseholdLoading] = useState(false);
    const [householdError, setHouseholdError] = useState<string | null>(null);

    const [chores, setChores] = useState<Chore[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);

    const userId = user?.id ?? "";

    useEffect(() => {
        let cancelled = false;

        async function loadHousehold() {
            if (!userId) return;

            setHouseholdLoading(true);
            setHouseholdError(null);

            try {
                const h = await fetchCurrentHousehold(userId);
                if (!cancelled) setHousehold(h);
            } catch (err) {
                console.error(err);
                if (!cancelled) setHouseholdError("Kon je huishouden niet laden.");
            } finally {
                if (!cancelled) setHouseholdLoading(false);
            }
        }

        loadHousehold();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            if (!household) return;

            setDataLoading(true);
            setDataError(null);

            try {
                const [choresRes, membersRes, rewardsRes] = await Promise.all([
                    fetchChoresForHousehold(household.id),
                    fetchMembersForHousehold(household.id),
                    fetchRewardsForHousehold(household.id),
                ]);

                if (!cancelled) {
                    setChores(choresRes);
                    setMembers(membersRes);
                    setRewards(rewardsRes);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) setDataError("Kon de gegevens van je huishouden niet laden.");
            } finally {
                if (!cancelled) setDataLoading(false);
            }
        }

        loadData();
        return () => {
            cancelled = true;
        };
    }, [household?.id]);

    // ---------- RENDER ----------

    if (!user) {
        return (
            <main className="cc-page">
                <div className="cc-grid-2">
                    <section className="cc-card cc-stack">
                        <h1 className="cc-card-title">Welkom bij ChoreChamp</h1>
                        <p className="cc-text-muted">
                            Log in of maak een account aan om je huishouden te organiseren, taken te verdelen en beloningen te verdienen.
                        </p>
                        <div className="flex gap-3">
                            <Link href="/login" className="cc-btn">
                                Inloggen
                            </Link>
                        </div>
                    </section>

                    <section className="cc-card cc-stack">
                        <h2 className="cc-card-title">Wat kun je met ChoreChamp?</h2>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-100/80">
                            <li>Maak een huishouden aan met je gezin of huisgenoten</li>
                            <li>Deel taken uit en houd bij wie wat heeft gedaan</li>
                            <li>Verdien punten en wissel ze in voor beloningen</li>
                        </ul>
                    </section>
                </div>
            </main>
        );
    }

    if (householdLoading && !household && !householdError) {
        return (
            <main className="cc-page cc-stack">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Welkom, {user.username}</h1>
                    <p className="cc-text-muted">We zijn je huishouden aan het laden…</p>
                </div>
            </main>
        );
    }

    if (!household && !householdLoading) {
        return (
            <main className="cc-page cc-stack">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Welkom, {user.username}</h1>

                    {householdError ? (
                        <p className="cc-text-muted">{householdError}</p>
                    ) : (
                        <p className="cc-text-muted">Je zit nog in geen huishouden.</p>
                    )}

                    <p className="cc-text-muted">
                        Start een nieuw huishouden of join er een met een invite code.
                    </p>

                    <Link href="/household/start" className="cc-btn w-fit">
                        Koppel aan een huishouden
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cc-page cc-stack">
            <section className="cc-card cc-stack">
                <div className="flex flex-col gap-2">
                    <h1 className="cc-card-title">Welkom, {user.username}</h1>
                    {household && (
                        <p className="cc-text-muted">
                            Je zit in huishouden{" "}
                            <span className="font-semibold">{household.name}</span> (invite code:{" "}
                            {household.inviteCode}).
                        </p>
                    )}
                    {dataError && <p className="text-red-500 text-sm mt-1">{dataError}</p>}
                </div>
            </section>

            <section className="cc-grid-3">
                <div className="cc-card cc-stack">
                    <h2 className="cc-card-title">Leden</h2>

                    {dataLoading && members.length === 0 ? (
                        <p className="cc-text-muted">Leden laden…</p>
                    ) : members.length === 0 ? (
                        <p className="cc-text-muted">Nog geen leden toegevoegd aan dit huishouden.</p>
                    ) : (
                        <ul className="space-y-2">
                            {members.map((m) => (
                                <li key={m.id} className="flex items-center justify-between text-sm">
                                    <span>{m.name}</span>
                                    <span className="text-xs text-slate-300">{m.currentPoints} punten</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Link href="/members" className="cc-link mt-2">
                        Leden beheren
                    </Link>
                </div>

                <div className="cc-card cc-stack">
                    <h2 className="cc-card-title">Taken</h2>

                    {dataLoading && chores.length === 0 ? (
                        <p className="cc-text-muted">Taken laden…</p>
                    ) : chores.length === 0 ? (
                        <p className="cc-text-muted">Nog geen taken aangemaakt.</p>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {chores.slice(0, 5).map((c) => (
                                <li key={c.id} className="flex justify-between">
                                    <span>{c.title}</span>
                                    <span className="text-xs text-slate-300">{c.points} pt</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Link href="/chores" className="cc-link mt-2">
                        Taken beheren
                    </Link>
                </div>

                <div className="cc-card cc-stack">
                    <h2 className="cc-card-title">Beloningen</h2>

                    {dataLoading && rewards.length === 0 ? (
                        <p className="cc-text-muted">Beloningen laden…</p>
                    ) : rewards.length === 0 ? (
                        <p className="cc-text-muted">Nog geen beloningen aangemaakt.</p>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {rewards.slice(0, 5).map((r) => (
                                <li key={r.id} className="flex justify-between">
                                    <span>{r.name}</span>
                                    <span className="text-xs text-slate-300">{r.cost} pt</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Link href="/rewards" className="cc-link mt-2">
                        Beloningen beheren
                    </Link>
                </div>
            </section>
        </main>
    );
}
