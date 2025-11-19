// src/lib/auth/useRequireRole.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

type Role = "ADMIN" | "MEMBER";

export function useRequireRole(allowed: Role[]) {
    const { user, isReady } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isReady) return; // <-- heel belangrijk: eerst wachten

        if (!user) {
            router.replace("/login");
            return;
        }

        if (!allowed.includes(user.role as Role)) {
            router.replace("/");
        }
    }, [user, isReady, router, allowed]);
}
