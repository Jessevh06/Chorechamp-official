"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login, register } = useAuth();

    const [mode, setMode] = useState<"login" | "register">("login");
    const [identifier, setIdentifier] = useState(""); // email of username
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === "login") {
                await login(identifier, password);
            } else {
                await register(email, username, password);
            }
            router.push("/");
        } catch (err) {
            console.error(err);
            setError(mode === "login" ? "Inloggen mislukt" : "Account aanmaken mislukt");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="cc-card" style={{ maxWidth: 420, width: "100%" }}>
                <div className="cc-card-header">
                    <h1 className="cc-card-title">ChoreChamp</h1>
                    <p className="cc-card-subtitle">
                        {mode === "login"
                            ? "Log in met je account"
                            : "Maak een nieuw account aan voor jouw huishouden"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        className={`cc-btn cc-btn-outline flex-1 ${
                            mode === "login" ? "cc-btn-active" : ""
                        }`}
                        onClick={() => setMode("login")}
                    >
                        Inloggen
                    </button>
                    <button
                        type="button"
                        className={`cc-btn cc-btn-outline flex-1 ${
                            mode === "register" ? "cc-btn-active" : ""
                        }`}
                        onClick={() => setMode("register")}
                    >
                        Nieuw account
                    </button>
                </div>

                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="cc-stack">
                    {mode === "login" ? (
                        <>
                            <div>
                                <label className="cc-label" htmlFor="identifier">
                                    Email of gebruikersnaam
                                </label>
                                <input
                                    id="identifier"
                                    className="cc-input"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="cc-label" htmlFor="password">
                                    Wachtwoord
                                </label>
                                <input
                                    id="password"
                                    className="cc-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="cc-label" htmlFor="reg-email">
                                    Email
                                </label>
                                <input
                                    id="reg-email"
                                    className="cc-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="cc-label" htmlFor="reg-username">
                                    Gebruikersnaam
                                </label>
                                <input
                                    id="reg-username"
                                    className="cc-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="cc-label" htmlFor="reg-password">
                                    Wachtwoord
                                </label>
                                <input
                                    id="reg-password"
                                    className="cc-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="cc-btn" disabled={loading}>
                        {loading
                            ? "Bezig..."
                            : mode === "login"
                                ? "Inloggen"
                                : "Account aanmaken"}
                    </button>
                </form>

                <p className="cc-text-muted mt-4 text-xs">
                    Demo-login als admin: <strong>admin / admin</strong>
                </p>
            </div>
        </main>
    );
}
