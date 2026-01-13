"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import type {
    HouseholdDto,
    CreateHouseholdRequest,
    JoinHouseholdRequest,
} from "@/lib/types/household";
import {
    createHouseholdForUser,
    joinHouseholdForUser, // ✅ FIX: import toevoegen
} from "@/lib/api/HouseholdMembershipApi";

export default function HouseholdStartPage() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [createName, setCreateName] = useState("");
    const [joinCode, setJoinCode] = useState("");

    const [createLoading, setCreateLoading] = useState(false);
    const [joinLoading, setJoinLoading] = useState(false);

    const [createError, setCreateError] = useState<string | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);

    if (!user) {
        return (
            <main className="cc-page cc-stack">
                <div className="cc-card cc-stack">
                    <h1 className="cc-card-title">Je bent niet ingelogd</h1>
                    <p className="cc-text-muted">
                        Log in om een huishouden te kunnen starten of joinen.
                    </p>
                </div>
            </main>
        );
    }

    const userId = user.id;

    async function handleCreateHousehold(e: FormEvent) {
        e.preventDefault();
        setCreateError(null);
        setCreateLoading(true);

        const body: CreateHouseholdRequest = { name: createName };

        try {
            const resp = await createHouseholdForUser(userId, body.name);

            // ✅ direct de role van de backend overnemen (ADMIN)
            if (resp?.user?.role) {
                updateUser({ role: resp.user.role as any });
            }

            console.log("Created household:", resp.household);
            router.push("/");
        } catch (err) {
            console.error(err);
            setCreateError("Huishouden aanmaken is mislukt. Probeer opnieuw.");
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleJoinHousehold(e: FormEvent) {
        e.preventDefault();
        setJoinError(null);
        setJoinLoading(true);

        const body: JoinHouseholdRequest = { inviteCode: joinCode };

        try {
            const data: HouseholdDto = await joinHouseholdForUser(userId, body.inviteCode);
            console.log("Joined household:", data);

            // ✅ joiner is MEMBER (backend zet dit ook, maar UI klopt dan direct)
            updateUser({ role: "MEMBER" as any });

            router.push("/");
        } catch (err: any) {
            console.error(err);
            const msg = String(err?.message || "");
            if (msg.includes("400") || msg.includes("404")) {
                setJoinError("Ongeldige of verlopen invite code.");
            } else {
                setJoinError("Kon het huishouden niet joinen. Probeer opnieuw.");
            }
        } finally {
            setJoinLoading(false);
        }
    }

    return (
        <main className="cc-page cc-stack">
            <div className="cc-card cc-stack">
                <h1 className="cc-card-title">Koppel je account aan een huishouden</h1>
                <p className="cc-text-muted">
                    Start een nieuw huishouden of join een bestaand huishouden via een invite code.
                </p>
            </div>

            <div className="cc-grid-2">
                {/* Nieuw huishouden starten */}
                <section className="cc-card cc-stack">
                    <h2 className="cc-card-title">Nieuw huishouden starten</h2>

                    <form onSubmit={handleCreateHousehold} className="cc-stack">
                        <div>
                            <label className="cc-label">Naam van het huishouden</label>
                            <input
                                className="cc-input"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                required
                            />
                        </div>

                        {createError && <p className="text-red-500 text-sm">{createError}</p>}

                        <button className="cc-btn" disabled={createLoading}>
                            {createLoading ? "Bezig..." : "Huishouden aanmaken"}
                        </button>
                    </form>
                </section>

                {/* Join huishouden */}
                <section className="cc-card cc-stack">
                    <h2 className="cc-card-title">Huishouden joinen</h2>

                    <form onSubmit={handleJoinHousehold} className="cc-stack">
                        <div>
                            <label className="cc-label">Invite code</label>
                            <input
                                className="cc-input"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                required
                            />
                        </div>

                        {joinError && <p className="text-red-500 text-sm">{joinError}</p>}

                        <button className="cc-btn" disabled={joinLoading}>
                            {joinLoading ? "Bezig..." : "Join huishouden"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
