"use client";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import MemberChoreList from "@/components/chores/MemberChoreList";

export default function UserTasksPage() {
    useRequireRole(["MEMBER", "ADMIN"]);

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-card-header-only">
                <h1 className="cc-card-title">Mijn taken</h1>
                <p className="cc-card-subtitle">Taken die aan jou zijn gekoppeld.</p>
            </div>

            <MemberChoreList />
        </main>
    );
}
