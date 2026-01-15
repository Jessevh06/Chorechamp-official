"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { JSX, useEffect, useState } from "react";
import { fetchCurrentHousehold } from "@/lib/api/HouseholdMembershipApi";
import type { HouseholdDto } from "@/lib/types/household";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isReady } = useAuth(); // ✅ isReady erbij

    const [household, setHousehold] = useState<HouseholdDto | null>(null);
    const [householdLoading, setHouseholdLoading] = useState(false);
    const [householdLoaded, setHouseholdLoaded] = useState(false);

    // Household van ingelogde user ophalen
    useEffect(() => {
        let cancelled = false;

        async function loadHousehold() {
            // Wacht tot auth uit localStorage is ingeladen
            if (!isReady) {
                setHousehold(null);
                setHouseholdLoading(false);
                setHouseholdLoaded(false);
                return;
            }

            // Reset alles als je uitgelogd bent
            if (!user) {
                setHousehold(null);
                setHouseholdLoading(false);
                setHouseholdLoaded(true); // ✅ auth is ready, en user is echt null
                return;
            }

            setHouseholdLoading(true);
            setHouseholdLoaded(false);

            try {
                const h = await fetchCurrentHousehold(user.id);
                if (!cancelled) {
                    setHousehold(h);
                }
            } catch (err) {
                console.error("Navbar: failed to load household", err);
                if (!cancelled) {
                    setHousehold(null);
                }
            } finally {
                if (!cancelled) {
                    setHouseholdLoading(false);
                    setHouseholdLoaded(true);
                }
            }
        }

        loadHousehold();

        return () => {
            cancelled = true;
        };
    }, [user, isReady]);

    function navItem(href: string, label: string) {
        const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
            <Link
                key={href}
                href={href}
                className={"cc-nav-link" + (isActive ? " cc-nav-link-active" : "")}
            >
                {label}
            </Link>
        );
    }

    const commonLinks: JSX.Element[] = [navItem("/", "Dashboard")];

    let roleLinks: JSX.Element[] = [];

    // ✅ Zolang auth nog niet klaar is: geen “beslissingen” nemen
    if (!isReady) {
        roleLinks = [];
    }
    // Niet ingelogd (maar wél zeker, want isReady=true)
    else if (!user) {
        roleLinks = [navItem("/login", "Inloggen")];
    }
    // Ingelogd, household check is klaar, en er is géén household
    else if (householdLoaded && !household) {
        roleLinks = [navItem("/household/start", "Huishouden koppelen")];
    }
    // Ingelogd + household
    else if (user.role === "MEMBER") {
        roleLinks = [
            navItem("/my", "Mijn omgeving"),
            navItem("/leaderboard", "Leaderboard"),
            navItem("/user/tasks", "Mijn Taken"),
            navItem("/user/rewards", "Punten Shop"),
        ];
    } else if (user.role === "ADMIN") {
        roleLinks = [
            navItem("/chores", "Taken"),
            navItem("/members", "Leden"),
            navItem("/rewards", "Beloningen"),
            navItem("/leaderboard", "Leaderboard"),
            navItem("/my", "Mijn omgeving"),
        ];
    } else {
        roleLinks = [navItem("/my", "Mijn omgeving")];
    }

    async function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <header className="cc-nav">
            <div className="cc-nav-inner">
                {/* Logo + household naam */}
                <Link href="/" className="cc-logo">
                    <span className="cc-logo-dot" />
                    <span>ChoreChamp</span>

                    {isReady && user && household && (
                        <span className="ml-2 text-xs text-slate-200/70">
                            · {household.name}
                        </span>
                    )}

                    {/* klein laadlabel terwijl auth/household nog bezig is */}
                    {(!isReady || (user && householdLoading)) && (
                        <span className="ml-2 text-xs text-slate-200/70">
                            · laden...
                        </span>
                    )}
                </Link>

                <nav className="cc-nav-links">
                    {commonLinks}
                    {roleLinks}

                    {isReady && user && (
                        <button
                            type="button"
                            className="cc-nav-link"
                            onClick={handleLogout}
                        >
                            Uitloggen ({user.username})
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
