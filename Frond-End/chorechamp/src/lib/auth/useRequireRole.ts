// src/lib/auth/useRequireRole.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

type Role = "ADMIN" | "MEMBER";

export function useRequireRole(allowed: Role[]) {
    const { user, isReady } = useAuth();
    const router = useRouter();

    // (optioneel) maakt de dependency stabiel
    const allowedKey = allowed.join(",");

    useEffect(() => {
        console.log("[useRequireRole] isReady:", isReady, "user:", user, "allowed:", allowedKey);

        if (!isReady) return;

        if (!user) {
            console.trace("[useRequireRole] redirect -> /login (user is null)");
            router.replace("/login");
            return;
        }

        if (!allowed.includes(user.role as Role)) {
            console.trace("[useRequireRole] redirect -> / (role not allowed)", user.role);
            router.replace("/");
            return;
        }

        console.log("[useRequireRole] OK - toegang toegestaan");
    }, [user, isReady, router, allowedKey]);
}
