"use client";

import { useState } from "react";
import { useRequireRole } from "@/lib/auth/useRequireRole";
import RewardForm from "@/components/rewards/RewardForm";
import RewardList from "@/components/rewards/RewardList";

export default function RewardsPage() {
    useRequireRole(["ADMIN"]);

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-card-header-only">
                <h1 className="cc-card-title">Beloningen beheren</h1>
                <p className="cc-card-subtitle">Maak beloningen aan per huishouden.</p>
            </div>

            <RewardForm onCreated={() => setRefreshKey((k) => k + 1)} />

            <div key={refreshKey}>
                <RewardList />
            </div>
        </main>
    );
}
