package com.example.chorechamp.household;

public class HouseholdDto {

    private String id;
    private String name;
    private String inviteCode;

    public HouseholdDto() {
    }

    public HouseholdDto(String id, String name, String inviteCode) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
    }

    public static HouseholdDto fromEntity(Household household) {
        return new HouseholdDto(
                household.getId(),
                household.getName(),
                household.getInviteCode()
        );
    }

    // getters & setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }
}
