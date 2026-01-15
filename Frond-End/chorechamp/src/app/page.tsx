"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

import { fetchChoresForHousehold, type Chore } from "@/lib/api/choreApi";
import { fetchMembersForHousehold, type Member } from "@/lib/api/memberApi";
import { fetchRewardsForHousehold, type Reward } from "@/lib/api/rewardApi";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";

import type { HouseholdDto } from "@/lib/types/household";

function SkeletonLines({ lines = 3 }: { lines?: number }) {
    return (
        <div className="cc-stack">
            <div className="cc-skeleton cc-skel-line lg cc-w-60" />
            {Array.from({ length: Math.max(0, lines - 1) }).map((_, i) => (
                <div key={i} className="cc-skeleton cc-skel-line cc-w-80" />
            ))}
        </div>
    );
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="cc-stack">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="cc-skeleton cc-skel-line cc-w-100" />
            ))}
        </div>
    );
}

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

    // Derived states
    const hasUser = !!user;
    const hasHousehold = !!household;
    const isLoadingHousehold = hasUser && householdLoading && !household && !householdError;
    const isLoadingData = hasHousehold && dataLoading;
    const showHouseholdJoinState = hasUser && !householdLoading && !household && !householdError;

    const showDashboard = hasUser && hasHousehold;

    // ---- Load household
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

    // ---- Load household data (parallel)
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

    // Helper: display name stable
    const username = useMemo(() => {
        if (!user) return "gast";
        return user.username || "gebruiker";
    }, [user]);

    return (
        <main className="cc-page cc-stack">
            {/* ✅ Bovenste card blijft ALTIJD bestaan => geen CLS jumps */}
            <section className="cc-card cc-stack" style={{ minHeight: 180 }}>
                <div className="flex flex-col gap-2">
                    <h1 className="cc-card-title">
                        Welkom{hasUser ? `, ${username}` : " bij ChoreChamp"}
                    </h1>

                    {/* --- Not logged in --- */}
                    {!hasUser && (
                        <>
                            <p className="cc-text-muted">
                                Log in of maak een account aan om je huishouden te organiseren,
                                taken te verdelen en beloningen te verdienen.
                            </p>

                            <div className="flex gap-3">
                                <Link href="/login" className="cc-btn">
                                    Inloggen
                                </Link>
                            </div>
                        </>
                    )}

                    {/* --- Loading household --- */}
                    {hasUser && isLoadingHousehold && (
                        <>
                            <p className="cc-text-muted">We zijn je huishouden aan het laden…</p>
                            <SkeletonLines lines={3} />
                        </>
                    )}

                    {/* --- Household error --- */}
                    {hasUser && householdError && (
                        <p className="cc-text-muted">{householdError}</p>
                    )}

                    {/* --- No household state --- */}
                    {hasUser && showHouseholdJoinState && (
                        <>
                            <p className="cc-text-muted">Je zit nog in geen huishouden.</p>
                            <p className="cc-text-muted">
                                Start een nieuw huishouden of join er een met een invite code.
                            </p>
                            <Link href="/household/start" className="cc-btn w-fit">
                                Koppel aan een huishouden
                            </Link>
                        </>
                    )}

                    {/* --- Household present --- */}
                    {showDashboard && (
                        <>
                            <p className="cc-text-muted">
                                Je zit in huishouden{" "}
                                <span className="font-semibold">{household!.name}</span> (invite
                                code: {household!.inviteCode}).
                            </p>

                            {dataError && (
                                <p className="text-red-500 text-sm mt-1">{dataError}</p>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* ✅ Grid blijft ook ALTIJD bestaan (maar toont skeletons indien nodig) */}
            <section className="cc-grid-3">
                {/* LEDEN */}
                <div className="cc-card cc-stack cc-card-list">
                    <h2 className="cc-card-title">Leden</h2>

                    {!showDashboard && (
                        <p className="cc-text-muted">
                            Log in en koppel een huishouden om leden te zien.
                        </p>
                    )}

                    {showDashboard && isLoadingData && members.length === 0 && (
                        <ListSkeleton rows={5} />
                    )}

                    {showDashboard && !isLoadingData && members.length === 0 && (
                        <p className="cc-text-muted">Nog geen leden toegevoegd aan dit huishouden.</p>
                    )}

                    {showDashboard && members.length > 0 && (
                        <ul className="space-y-2">
                            {members.map((m) => (
                                <li key={m.id} className="flex items-center justify-between text-sm">
                                    <span>{m.name}</span>
                                    <span className="text-xs text-slate-300">
                    {m.currentPoints} punten
                  </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Link href="/members" className="cc-link mt-2">
                        Leden beheren
                    </Link>
                </div>

                {/* TAKEN */}
                <div className="cc-card cc-stack cc-card-list">
                    <h2 className="cc-card-title">Taken</h2>

                    {!showDashboard && (
                        <p className="cc-text-muted">
                            Log in en koppel een huishouden om taken te zien.
                        </p>
                    )}

                    {showDashboard && isLoadingData && chores.length === 0 && (
                        <ListSkeleton rows={5} />
                    )}

                    {showDashboard && !isLoadingData && chores.length === 0 && (
                        <p className="cc-text-muted">Nog geen taken aangemaakt.</p>
                    )}

                    {showDashboard && chores.length > 0 && (
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

                {/* BELONINGEN */}
                <div className="cc-card cc-stack cc-card-list">
                    <h2 className="cc-card-title">Beloningen</h2>

                    {!showDashboard && (
                        <p className="cc-text-muted">
                            Log in en koppel een huishouden om beloningen te zien.
                        </p>
                    )}

                    {showDashboard && isLoadingData && rewards.length === 0 && (
                        <ListSkeleton rows={5} />
                    )}

                    {showDashboard && !isLoadingData && rewards.length === 0 && (
                        <p className="cc-text-muted">Nog geen beloningen aangemaakt.</p>
                    )}

                    {showDashboard && rewards.length > 0 && (
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
