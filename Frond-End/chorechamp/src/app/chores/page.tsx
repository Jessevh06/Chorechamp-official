// src/app/chores/page.tsx
"use client";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import ChoreList from "@/components/chores/ChoreList";
import ChoreForm from "@/components/chores/ChoreForm";

export default function ChoresPage() {
    useRequireRole(["ADMIN"]);
 // add chores
    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-card-header-only">
                <h1 className="cc-card-title">Taken beheren</h1>
                <p className="cc-card-subtitle">
                    Bekijk, voeg toe en wijzig huishoudtaken.
                </p>
            </div>

            <ChoreForm />
            <ChoreList />
        </main>
    );
}
