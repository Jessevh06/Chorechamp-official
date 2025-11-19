"use client";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import RewardList from "@/components/rewards/RewardList";
import RewardForm from "@/components/rewards/RewardForm";

export default function RewardsPage() {
    useRequireRole(["ADMIN"]);

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-card-header-only">
                <h1 className="cc-card-title">Beloningen beheren</h1>
                <p className="cc-card-subtitle">
                    Stel beloningen in die leden kunnen kopen.
                </p>
            </div>

            <RewardForm />
            <RewardList />
        </main>
    );
}
