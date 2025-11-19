package com.example.chorechamp.member;

public class MemberPointsRequest {
    private int points;

    public MemberPointsRequest() {
    }

    public MemberPointsRequest(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }
}
