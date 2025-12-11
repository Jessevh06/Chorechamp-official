// src/app/page.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchChores, Chore } from "@/lib/api/choreApi";
import { fetchMembers, Member } from "@/lib/api/memberApi";
import { fetchRewards, Reward } from "@/lib/api/rewardApi";

/* ---------- Types ---------- */

type DashboardData = {
    chores: Chore[];
    members: Member[];
    rewards: Reward[];
    loading: boolean;
};

type SectionHeaderProps = {
    title: string;
    subtitle?: string;
    action?: ReactNode;
};

type ChoreListProps = {
    chores: Chore[];
    loading: boolean;
    emptyText: string;
    maxItems?: number;
    pointsPrefix?: string;
};

type RewardListProps = {
    rewards: Reward[];
    loading: boolean;
    maxItems?: number;
};

/* ---------- Kleine UI-componenten ---------- */

function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-3">
            <div>
                <h2 className="cc-card-title mb-1">{title}</h2>
                {subtitle && <p className="cc-card-subtitle">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

function ChoreList({
                       chores,
                       loading,
                       emptyText,
                       maxItems = 5,
                       pointsPrefix = "",
                   }: ChoreListProps) {
    if (loading) {
        return <p className="cc-text-muted">Taken laden…</p>;
    }

    if (chores.length === 0) {
        return <p className="cc-text-muted">{emptyText}</p>;
    }

    return (
        <ul className="cc-list">
            {chores.slice(0, maxItems).map((c) => (
                <li key={c.id} className="cc-list-item">
                    <div>
                        <div className="font-medium">{c.title}</div>
                        {c.description && (
                            <div className="cc-text-muted text-xs">{c.description}</div>
                        )}
                    </div>
                    <span className="cc-list-tag">
            {pointsPrefix}
                        {c.points} pt
          </span>
                </li>
            ))}
        </ul>
    );
}

function RewardList({ rewards, loading, maxItems = 5 }: RewardListProps) {
    if (loading) {
        return <p className="cc-text-muted">Beloningen laden…</p>;
    }

    if (rewards.length === 0) {
        return (
            <p className="cc-text-muted">Er zijn nog geen beloningen ingesteld.</p>
        );
    }

    return (
        <ul className="cc-list">
            {rewards.slice(0, maxItems).map((r) => (
                <li key={r.id} className="cc-list-item">
                    <div>
                        <div className="font-medium">{r.name}</div>
                        {r.description && (
                            <div className="cc-text-muted text-xs">{r.description}</div>
                        )}
                    </div>
                    <span className="cc-list-tag">{r.cost} pt</span>
                </li>
            ))}
        </ul>
    );
}

/* ---------- Pagina ---------- */

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

    // Member koppelen aan user
    const myMember = members.find((m) => m.name === user.username) ?? null;

    const myCurrentPoints = myMember?.currentPoints ?? 0;
    const myTotalEarned = myMember?.totalEarned ?? 0;

    const openChores = chores.filter((c) => !c.done);
    const doneChores = chores.filter((c) => c.done);

    const tasksLabel = isAdmin ? "Openstaande taken" : "Taken te doen";

    return (
        <main className="cc-page cc-stack">
            {/* Header */}
            <div className="cc-card cc-stack">
                <h1 className="cc-card-title">
                    Hoi {user.username}, {isAdmin ? "admin" : "member"}
                </h1>
                <p className="cc-text-muted">
                    {isAdmin
                        ? "Beheer taken, leden en beloningen."
                        : "Bekijk je punten, taken en beloningen."}
                </p>
            </div>

            {/* Overzichtskaart met stats */}
            <section className="cc-card cc-stack">
                <h2 className="cc-card-title mb-1">Overzicht</h2>
                <p className="cc-text-muted mb-3">
                    Snel overzicht van je punten en taken.
                </p>
                <ul className="cc-list">
                    <li className="cc-list-item">
                        <span>Beschikbare punten</span>
                        <span className="cc-list-value">
              {loading ? "…" : myCurrentPoints}
            </span>
                    </li>
                    <li className="cc-list-item">
                        <span>Totaal verdiend</span>
                        <span className="cc-list-value">
              {loading ? "…" : myTotalEarned}
            </span>
                    </li>
                    <li className="cc-list-item">
                        <span>{tasksLabel}</span>
                        <span className="cc-list-value">
              {loading ? "…" : openChores.length}
            </span>
                    </li>
                </ul>
                {!myMember && (
                    <p className="cc-text-muted mt-2 text-sm">
                        Je bent nog niet gekoppeld aan een member. Vraag je
                        huishoudhoofd om je toe te voegen.
                    </p>
                )}
            </section>

            {/* Admin: beheer-overzicht */}
            {isAdmin && (
                <section className="cc-grid-2">
                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Huishouden"
                            subtitle="Leden, beloningen en afgeronde taken."
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
                        <ChoreList
                            chores={openChores}
                            loading={loading}
                            emptyText="Er zijn op dit moment geen openstaande taken."
                        />
                    </div>
                </section>
            )}

            {/* Member: persoonlijke overview */}
            {!isAdmin && (
                <section className="cc-grid-2">
                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Mijn taken"
                            subtitle={`Taken die je nu kunt oppakken (${openChores.length}).`}
                            action={
                                <Link href="/user/tasks" className="cc-btn cc-btn-outline">
                                    Naar mijn taken
                                </Link>
                            }
                        />
                        <ChoreList
                            chores={openChores}
                            loading={loading}
                            emptyText="Er zijn nog geen taken ingepland. Vraag je admin om taken toe te voegen."
                            pointsPrefix="+"
                        />
                    </div>

                    <div className="cc-card cc-stack">
                        <SectionHeader
                            title="Beloningen"
                            subtitle={`Beloningen waar je je punten aan kunt uitgeven (${rewards.length}).`}
                            action={
                                <Link href="/user/rewards" className="cc-btn cc-btn-outline">
                                    Naar beloningsshop
                                </Link>
                            }
                        />
                        <RewardList rewards={rewards} loading={loading} />
                    </div>
                </section>
            )}
        </main>
    );
}
