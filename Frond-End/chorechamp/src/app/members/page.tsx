"use client";

import { useRequireRole } from "@/lib/auth/useRequireRole";



export default function MembersPage() {
    useRequireRole(["ADMIN"]);

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-card-header-only">
                <h1 className="cc-card-title">Leden beheren</h1>
                <p className="cc-card-subtitle">
                    Voeg leden toe of wijzig bestaande leden.
                </p>
            </div>
        </main>
    );
}
