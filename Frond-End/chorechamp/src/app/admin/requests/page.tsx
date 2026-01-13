// src/lib/api/HouseholdMembershipApi.ts

export type HouseholdDto = {
    id: string;
    name: string;
    inviteCode: string;
};

export type UserDto = {
    id: string;
    username: string;
    email: string;
    role: "ADMIN" | "MEMBER" | string;
};

export type CreateHouseholdResponse = {
    household: HouseholdDto;
    user: UserDto;
};

export type PendingMember = {
    id: string;
    name: string;
    avatarColor?: string | null;
};

const API_BASE = "http://localhost:8080/api";
const MEMBERSHIP_BASE = `${API_BASE}/household-membership`;
const HOUSEHOLDS_BASE = `${API_BASE}/households`;

// ✅ Create household (returns household + updated user role)
export async function createHouseholdForUser(
    userId: string,
    name: string
): Promise<CreateHouseholdResponse> {
    const res = await fetch(`${MEMBERSHIP_BASE}/${encodeURIComponent(userId)}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("createHouseholdForUser error:", res.status, error);
        throw new Error("Failed to create household");
    }

    return res.json();
}

// ✅ Join household (invite code)
export async function joinHouseholdForUser(userId: string, inviteCode: string): Promise<HouseholdDto> {
    const res = await fetch(`${MEMBERSHIP_BASE}/${encodeURIComponent(userId)}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("joinHouseholdForUser error:", res.status, error);
        throw new Error("Failed to join household");
    }

    return res.json();
}

// ✅ Current household (helper used by Navbar)
export async function fetchCurrentHousehold(userId: string): Promise<HouseholdDto | null> {
    const res = await fetch(`${HOUSEHOLDS_BASE}/current?userId=${encodeURIComponent(userId)}`, {
        cache: "no-store",
    });

    if (res.status === 404 || res.status === 204) return null;
    if (!res.ok) {
        const error = await res.text();
        console.error("fetchCurrentHousehold error:", res.status, error);
        throw new Error("Failed to fetch current household");
    }

    return res.json();
}

// ✅ Admin: pending join requests
export async function fetchPendingRequests(userId: string): Promise<PendingMember[]> {
    const res = await fetch(`${MEMBERSHIP_BASE}/${encodeURIComponent(userId)}/requests`, {
        cache: "no-store",
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("fetchPendingRequests error:", res.status, error);
        throw new Error("Failed to fetch pending requests");
    }

    return res.json();
}

// ✅ Admin: accept a member
export async function acceptPendingMember(userId: string, memberId: string): Promise<void> {
    const res = await fetch(
        `${MEMBERSHIP_BASE}/${encodeURIComponent(userId)}/accept/${encodeURIComponent(memberId)}`,
        { method: "POST" }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error("acceptPendingMember error:", res.status, error);
        throw new Error("Failed to accept member");
    }
}
