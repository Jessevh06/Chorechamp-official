// src/lib/api/memberApi.ts

export type Member = {
    id: string;
    name: string;
    avatarColor?: string | null;
    currentPoints: number;      // beschikbare punten
    totalEarned: number;        // totaal ooit verdiend (frontend naam)
    approved?: boolean;         // ✅ nieuw (voor join/accept flow
    totalEarnedPoints?: number;
};

// Backend shape (zoals jouw MemberDto nu waarschijnlijk terugstuurt)
type MemberApiDto = {
    id: string;
    name: string;
    avatarColor?: string | null;
    currentPoints: number;
    totalEarnedPoints: number;  // backend naam
    approved?: boolean;
};

const API_BASE = "http://localhost:8080/api";
const MEMBERS_BASE_URL = `${API_BASE}/members`;
const HOUSEHOLDS_BASE_URL = `${API_BASE}/households`;

function mapMember(dto: MemberApiDto): Member {
    return {
        id: dto.id,
        name: dto.name,
        avatarColor: dto.avatarColor ?? null,
        currentPoints: dto.currentPoints,
        totalEarned: dto.totalEarnedPoints,   // ✅ mapping
        approved: dto.approved,
    };
}

function mapMembers(dtos: MemberApiDto[]): Member[] {
    return dtos.map(mapMember);
}

// ✅ GET — member record op basis van userId (voor approved/pending check)
export async function fetchMemberByUserId(userId: string): Promise<Member> {
    const res = await fetch(`${MEMBERS_BASE_URL}/by-user/${encodeURIComponent(userId)}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("fetchMemberByUserId error:", res.status, error);
        throw new Error("Failed to fetch member by userId");
    }

    const dto: MemberApiDto = await res.json();
    return mapMember(dto);
}

// GET — alle leden ophalen (alle members in het hele systeem)
export async function fetchMembers(): Promise<Member[]> {
    const res = await fetch(MEMBERS_BASE_URL, { cache: "no-store" });

    if (!res.ok) {
        const error = await res.text();
        console.error("fetchMembers error:", error);
        throw new Error("Failed to fetch members");
    }

    const dtos: MemberApiDto[] = await res.json();
    return mapMembers(dtos);
}

// POST — nieuw lid aanmaken (zonder household, legacy)
export async function createMember(input: { name: string }): Promise<Member> {
    const res = await fetch(MEMBERS_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input.name }),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("createMember backend error:", res.status, error);
        throw new Error("Failed to create member");
    }

    const dto: MemberApiDto = await res.json();
    return mapMember(dto);
}

// PUT — lid bijwerken
export async function updateMember(id: string, input: Partial<Member>): Promise<Member> {
    // back-mapping naar backend velden
    const payload: any = { ...input };
    if (payload.totalEarned !== undefined) {
        payload.totalEarnedPoints = payload.totalEarned;
        delete payload.totalEarned;
    }

    const res = await fetch(`${MEMBERS_BASE_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error(`updateMember error (${id}):`, error);
        throw new Error("Failed to update member");
    }

    const dto: MemberApiDto = await res.json();
    return mapMember(dto);
}

// DELETE — lid verwijderen
export async function deleteMember(id: string): Promise<void> {
    const res = await fetch(`${MEMBERS_BASE_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });

    if (!res.ok) {
        const error = await res.text();
        console.error(`deleteMember error (${id}):`, error);
        throw new Error("Failed to delete member");
    }
}

// POST — punten geven aan een lid (/award endpoint in je backend)
export async function awardMemberPoints(id: string, points: number): Promise<Member> {
    if (points < 0) throw new Error("Points cannot be negative");

    const res = await fetch(`${MEMBERS_BASE_URL}/${encodeURIComponent(id)}/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("awardMemberPoints backend error:", res.status, error);
        throw new Error("Failed to award points");
    }

    const dto: MemberApiDto = await res.json();
    return mapMember(dto);
}

export async function fetchMembersForHousehold(householdId: string): Promise<Member[]> {
    const res = await fetch(
        `${HOUSEHOLDS_BASE_URL}/${encodeURIComponent(householdId)}/members`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error(`fetchMembersForHousehold error (${householdId}):`, res.status, error);
        throw new Error("Failed to fetch members for household");
    }

    const data = await res.json();
    return (Array.isArray(data) ? data : []).map(normalizeMember);
}


// POST — nieuw lid aanmaken binnen een specifiek huishouden
export async function createMemberForHousehold(
    householdId: string,
    input: { name: string; avatarColor?: string | null }
): Promise<Member> {
    const res = await fetch(
        `${HOUSEHOLDS_BASE_URL}/${encodeURIComponent(householdId)}/members`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error(`createMemberForHousehold error (${householdId}):`, res.status, error);
        throw new Error("Failed to create member for household");
    }

    const dto: MemberApiDto = await res.json();
    return mapMember(dto);
}
function normalizeMember(raw: any): Member {
    return {
        id: raw.id,
        name: raw.name,
        avatarColor: raw.avatarColor ?? null,
        currentPoints: Number(raw.currentPoints ?? 0),

        // ✅ backend kan totalEarnedPoints sturen
        totalEarned: Number(raw.totalEarned ?? raw.totalEarnedPoints ?? 0),
        totalEarnedPoints: raw.totalEarnedPoints,
    };
}

