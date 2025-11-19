// src/lib/auth/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/api/authApi";
import { login as apiLogin, register as apiRegister } from "@/lib/api/authApi";

type AuthContextValue = {
    user: User | null;
    isAdmin: boolean;
    isReady: boolean; // <-- nieuw
    login: (identifier: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("chore_user");
            if (raw) {
                setUser(JSON.parse(raw));
            }
        } catch (e) {
            console.warn("Failed to load stored user", e);
        } finally {
            setIsReady(true); // <-- nu pas mogen guards gaan beslissen
        }
    }, []);

    function setAndStore(u: User | null) {
        setUser(u);
        if (u) localStorage.setItem("chore_user", JSON.stringify(u));
        else localStorage.removeItem("chore_user");
    }

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
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin: user?.role === "ADMIN",
                isReady,
                login,
                register,
                logout,
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
