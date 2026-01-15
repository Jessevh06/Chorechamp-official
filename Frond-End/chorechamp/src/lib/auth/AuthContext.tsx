"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/api/authApi";
import { login as apiLogin, register as apiRegister } from "@/lib/api/authApi";
import { fetchMemberByUserId, type Member } from "@/lib/api/memberApi";

type AuthContextValue = {
    user: User | null;
    member: Member | null;

    isAdmin: boolean;
    isReady: boolean;

    // ✅ nieuw: status helpers
    isApproved: boolean;
    needsApproval: boolean;

    login: (identifier: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;

    updateUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("chore_user");
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            console.warn("Failed to load stored user", e);
        } finally {
            setIsReady(true);
        }
    }, []);

    function setAndStore(u: User | null) {
        setUser(u);
        if (u) localStorage.setItem("chore_user", JSON.stringify(u));
        else localStorage.removeItem("chore_user");
    }

    function updateUser(patch: Partial<User>) {
        setUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, ...patch };
            localStorage.setItem("chore_user", JSON.stringify(next));
            return next;
        });
    }

    // ✅ wanneer user bekend is: haal member status op (approved/pending/household)
    useEffect(() => {
        let cancelled = false;

        async function loadMember() {
            if (!user?.id) {
                setMember(null);
                return;
            }
            try {
                const m = await fetchMemberByUserId(user.id);
                if (!cancelled) setMember(m);
            } catch (e) {
                // Als user nog geen member heeft (kan), dan member=null laten.
                if (!cancelled) setMember(null);
            }
        }

        loadMember();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    async function login(identifier: string, password: string) {
        const u = await apiLogin(identifier, password);
        setAndStore(u);
    }

    async function register(email: string, username: string, password: string) {
        const u = await apiRegister({ email, username, password });
        setAndStore(u);
    }

    function logout() {
        setAndStore(null);
        setMember(null);
    }

    const isAdmin = user?.role === "ADMIN";
    const isApproved = member?.approved === true;

    // ✅ joiner: MEMBER + member bestaat + approved=false
    const needsApproval = !!user && !!member && member.approved === false;

    return (
        <AuthContext.Provider
            value={{
                user,
                member,
                isAdmin,
                isReady,
                isApproved,
                needsApproval,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
