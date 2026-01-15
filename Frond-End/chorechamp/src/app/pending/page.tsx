"use client";
import { useAuth } from "@/lib/auth/AuthContext";

export default function PendingPage() {
    const { user } = useAuth();
    return (
        <div className="cc-card">
            <h2 className="text-lg font-semibold">Wachten op acceptatie</h2>
            <p className="cc-text-muted mt-2">
                Je bent gejoind als <b>{user?.username}</b>, maar het huishoudhoofd moet je nog accepteren.
            </p>
        </div>
    );
}
