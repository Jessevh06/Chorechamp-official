// src/app/my/page.tsx
"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";

export default function MyPage() {
    const { user, isAdmin } = useAuth();

    if (!user) {
        return null; // wordt al afgehandeld via navbar/guards
    }

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-stack">
                <h1 className="cc-card-title">Mijn omgeving</h1>
                <p className="cc-text-muted">
                    {isAdmin
                        ? "Je bent admin. Hier zie je je persoonlijke overzicht."
                        : "Overzicht van jouw punten, taken en aankopen."}
                </p>
            </div>

            <div className="cc-grid-3">
                <DashboardTile
                    title="Mijn punten"
                    description="Bekijk hoeveel punten je hebt en hoeveel je in totaal verdiend hebt."
                    href="/user/points"
                    cta="Bekijk punten"
                />
                <DashboardTile
                    title="Mijn taken"
                    description="Taken die je nog moet doen of al hebt gedaan."
                    href="/user/tasks"
                    cta="Naar mijn taken"
                />
                <DashboardTile
                    title="Beloningsshop"
                    description="Koop iets leuks van je verdiende punten."
                    href="/user/rewards"
                    cta="Naar shop"
                />
            </div>
        </main>
    );
}

type TileProps = {
    title: string;
    description: string;
    href: string;
    cta: string;
};

function DashboardTile({ title, description, href, cta }: TileProps) {
    return (
        <div className="cc-card">
            <h2 className="cc-card-title">{title}</h2>
            <p className="cc-text-muted mb-4">{description}</p>
            <Link href={href} className="cc-btn cc-btn-outline">
                {cta}
            </Link>
        </div>
    );
}
