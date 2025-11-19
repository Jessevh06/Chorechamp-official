export type UserRole = "HUISHOUDHOOFD" | "LID";

export type AppUser = {
    memberId: string | null;
    name: string;
    role: UserRole;
};
