package com.example.chorechamp.member;

public class MemberDto {

    private String id;
    private String name;
    private String avatarColor;
    private int currentPoints;
    private int totalEarnedPoints;

    public MemberDto() {
    }

    public MemberDto(String id,
                     String name,
                     String avatarColor,
                     int currentPoints,
                     int totalEarnedPoints) {
        this.id = id;
        this.name = name;
        this.avatarColor = avatarColor;
        this.currentPoints = currentPoints;
        this.totalEarnedPoints = totalEarnedPoints;
    }

    public static MemberDto fromEntity(Member member) {
        return new MemberDto(
                member.getId(),
                member.getName(),
                member.getAvatarColor(),
                member.getCurrentPoints(),
                member.getTotalEarnedPoints()
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

    public String getAvatarColor() {
        return avatarColor;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }

    public int getCurrentPoints() {
        return currentPoints;
    }

    public void setCurrentPoints(int currentPoints) {
        this.currentPoints = currentPoints;
    }

    public int getTotalEarnedPoints() {
        return totalEarnedPoints;
    }

    public void setTotalEarnedPoints(int totalEarnedPoints) {
        this.totalEarnedPoints = totalEarnedPoints;
    }
}
