// src/types/household.ts

export type HouseholdDto = {
    id: string;
    name: string;
    inviteCode: string;
};

export type CreateHouseholdRequest = {
    name: string;
};

export type JoinHouseholdRequest = {
    inviteCode: string;
};
