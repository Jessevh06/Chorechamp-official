// src/app/user/rewards/page.tsx
"use client";

import { useRequireRole } from "@/lib/auth/useRequireRole";
import RewardShop from "@/components/rewards/RewardShop";

export default function MemberRewardsPage() {
    useRequireRole(["MEMBER", "ADMIN"]);

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-card-header-only">
                <h1 className="cc-card-title">Beloningsshop</h1>
                <p className="cc-card-subtitle">
                    Wissel je eigen punten in voor beloningen.
                </p>
            </div>

            <RewardShop />
        </main>
    );
}
