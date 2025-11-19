"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { JSX } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    function navItem(href: string, label: string) {
        const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
            <Link
                key={href}
                href={href}
                className={
                    "cc-nav-link" + (isActive ? " cc-nav-link-active" : "")
                }
            >
                {label}
            </Link>
        );
    }

    const commonLinks: JSX.Element[] = [navItem("/", "Dashboard")];

    let roleLinks: JSX.Element[] = [];

    if (!user) {
        roleLinks = [navItem("/login", "Inloggen")];
    }
    else if (user.role === "MEMBER") {
        roleLinks = [
            navItem("/my", "Mijn omgeving"),
            navItem("/leaderboard", "Leaderboard"),
            navItem("/user/tasks", "Mijn Taken"),
            navItem("/user/rewards", "Punten Shop"),
        ];
    }
    else if (user.role === "ADMIN") {
        roleLinks = [
            navItem("/chores", "Taken"),
            navItem("/members", "Leden"),
            navItem("/rewards", "Beloningen"),
            navItem("/leaderboard", "Leaderboard"),
            navItem("/my", "Mijn omgeving"),
        ];
    }

    async function handleLogout() {
        logout();
        router.push("/login");
    }

    return (
        <header className="cc-nav">
            <div className="cc-nav-inner">

                {/* Logo */}
                <Link href="/" className="cc-logo">
                    <span className="cc-logo-dot" />
                    <span>ChoreChamp</span>
                </Link>

                <nav className="cc-nav-links">
                    {commonLinks}
                    {roleLinks}

                    {user && (
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
