// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchChores, Chore } from "@/lib/api/choreApi";
import { fetchMembers, Member } from "@/lib/api/memberApi";
import { fetchRewards, Reward } from "@/lib/api/rewardApi";

type DashboardData = {
    chores: Chore[];
    members: Member[];
    rewards: Reward[];
    loading: boolean;
};

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();
    const [data, setData] = useState<DashboardData>({
        chores: [],
        members: [],
        rewards: [],
        loading: true,
    });

    useEffect(() => {
        if (!user) return;

        async function load() {
            try {
                const [chores, members, rewards] = await Promise.all([
                    fetchChores(),
                    fetchMembers(),
                    fetchRewards(),
                ]);

                setData({ chores, members, rewards, loading: false });
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setData((prev) => ({ ...prev, loading: false }));
            }
        }

        load();
    }, [user]);

    // Niet ingelogd → simpel welkom + login-link
    if (!user) {
        return (
            <main className="cc-page">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Welkom bij ChoreChamp</h1>
                    <p className="cc-text-muted">
                        Log in om je huishouden eerlijk en overzichtelijk te houden.
                    </p>
                    <Link href="/login" className="cc-btn cc-btn-primary w-fit">
                        Inloggen
                    </Link>
                </div>
            </main>
        );
    }

    const { chores, members, rewards, loading } = data;

    // Probeer de Member te vinden die bij deze user hoort (op basis van naam)
    const myMember =
        members.find((m) => m.name === user.username) ?? null;

    const myCurrentPoints = myMember?.currentPoints ?? 0;
    const myTotalEarned = myMember?.totalEarned ?? 0;

    const openChores = chores.filter((c) => !c.done);
    const doneChores = chores.filter((c) => c.done);

    return (
        <main className="cc-page cc-stack">
            {/* Header */}
            <div className="cc-card cc-stack">
                <h1 className="cc-card-title">
                    Hoi {user.username}, {isAdmin ? "admin" : "member"}
                </h1>
                <p className="cc-text-muted">
                    {isAdmin
                        ? "Beheer taken, leden en beloningen en houd overzicht over je huishouden."
                        : "Zie welke taken je kunt doen, hoeveel punten je hebt en welke beloningen je kunt pakken."}
                </p>
            </div>

            {/* Metrics row */}
            <section className="cc-card">
                <div className="cc-grid-3">
                    <MetricCard
                        label="Beschikbare punten"
                        value={loading ? "…" : myCurrentPoints.toString()}
                        hint={
                            myMember
                                ? "Punten die je nu kunt uitgeven in de beloningsshop."
                                : "Je bent nog niet gekoppeld aan een member."
                        }
                    />
                    <MetricCard
                        label="Totaal verdiend"
                        value={loading ? "…" : myTotalEarned.toString()}
                        hint="Hoeveel punten je in totaal hebt verzameld."
                    />
                    <MetricCard
                        label={isAdmin ? "Openstaande taken" : "Taken te doen"}
                        value={loading ? "…" : openChores.length.toString()}
                        hint={
                            isAdmin
                                ? "Taken in het huishouden die nog niet zijn afgevinkt."
                                : "Taken die je kunt oppakken om punten te verdienen."
                        }
                    />
                </div>
            </section>

            {/* Voor admin: beheer-overzicht */}
            {isAdmin && (
                <section className="cc-grid-2">
                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Huishouden overzicht"
                            subtitle="Snel inzicht in leden en taken."
                            action={
                                <Link href="/members" className="cc-btn cc-btn-outline">
                                    Naar leden
                                </Link>
                            }
                        />
                        <ul className="cc-list">
                            <li className="cc-list-item">
                                <span>Leden in het huishouden</span>
                                <span className="cc-list-value">
                                    {loading ? "…" : members.length}
                                </span>
                            </li>
                            <li className="cc-list-item">
                                <span>Beloningen ingesteld</span>
                                <span className="cc-list-value">
                                    {loading ? "…" : rewards.length}
                                </span>
                            </li>
                            <li className="cc-list-item">
                                <span>Afgeronde taken</span>
                                <span className="cc-list-value">
                                    {loading ? "…" : doneChores.length}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Openstaande taken"
                            subtitle="Een selectie van taken die nog gedaan moeten worden."
                            action={
                                <Link href="/chores" className="cc-btn cc-btn-outline">
                                    Taken beheren
                                </Link>
                            }
                        />
                        {loading ? (
                            <p className="cc-text-muted">Taken laden…</p>
                        ) : openChores.length === 0 ? (
                            <p className="cc-text-muted">
                                Er zijn op dit moment geen openstaande taken.
                            </p>
                        ) : (
                            <ul className="cc-list">
                                {openChores.slice(0, 5).map((c) => (
                                    <li key={c.id} className="cc-list-item">
                                        <div>
                                            <div className="font-medium">{c.title}</div>
                                            {c.description && (
                                                <div className="cc-text-muted text-xs">
                                                    {c.description}
                                                </div>
                                            )}
                                        </div>
                                        <span className="cc-list-tag">
                                            {c.points} pt
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}

            {/* Voor member: persoonlijke overview */}
            {!isAdmin && (
                <section className="cc-grid-2">
                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Mijn taken"
                            subtitle="Taken die je nu kunt oppakken."
                            action={
                                <Link href="/user/tasks" className="cc-btn cc-btn-outline">
                                    Naar mijn taken
                                </Link>
                            }
                        />
                        {loading ? (
                            <p className="cc-text-muted">Taken laden…</p>
                        ) : openChores.length === 0 ? (
                            <p className="cc-text-muted">
                                Er zijn nog geen taken ingepland. Vraag je admin om taken toe
                                te voegen.
                            </p>
                        ) : (
                            <ul className="cc-list">
                                {openChores.slice(0, 5).map((c) => (
                                    <li key={c.id} className="cc-list-item">
                                        <div>
                                            <div className="font-medium">{c.title}</div>
                                            {c.description && (
                                                <div className="cc-text-muted text-xs">
                                                    {c.description}
                                                </div>
                                            )}
                                        </div>
                                        <span className="cc-list-tag">
                                            +{c.points} pt
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Beloningen"
                            subtitle="Dingen waar je je punten aan kunt uitgeven."
                            action={
                                <Link href="/user/rewards" className="cc-btn cc-btn-outline">
                                    Naar beloningsshop
                                </Link>
                            }
                        />
                        {loading ? (
                            <p className="cc-text-muted">Beloningen laden…</p>
                        ) : rewards.length === 0 ? (
                            <p className="cc-text-muted">
                                Er zijn nog geen beloningen ingesteld.
                            </p>
                        ) : (
                            <ul className="cc-list">
                                {rewards.slice(0, 5).map((r) => (
                                    <li key={r.id} className="cc-list-item">
                                        <div>
                                            <div className="font-medium">{r.name}</div>
                                            {r.description && (
                                                <div className="cc-text-muted text-xs">
                                                    {r.description}
                                                </div>
                                            )}
                                        </div>
                                        <span className="cc-list-tag">
                                            {r.cost} pt
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}

/* Kleine herbruikbare UI-blokken */

type MetricProps = {
    label: string;
    value: string;
    hint?: string;
};

function MetricCard({ label, value, hint }: MetricProps) {
    return (
        <div className="cc-metric">
            <div className="cc-metric-label">{label}</div>
            <div className="cc-metric-value">{value}</div>
            {hint && <div className="cc-metric-hint">{hint}</div>}
        </div>
    );
}

type SectionHeaderProps = {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
};

function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-3">
            <div>
                <h2 className="cc-card-title mb-1">{title}</h2>
                {subtitle && (
                    <p className="cc-card-subtitle">{subtitle}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
