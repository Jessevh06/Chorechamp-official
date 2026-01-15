package com.example.chorechamp.member;

import com.example.chorechamp.household.Household;
import com.example.chorechamp.user.User;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String avatarColor;

    @Column(nullable = false)
    private int currentPoints;

    @Column(nullable = false)
    private int totalEarnedPoints;

    @Column(nullable = false)
    private boolean approved = false;

    @ManyToOne
    @JoinColumn(name = "household_id")
    private Household household;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Member() {}

    public Member(
            String id,
            String name,
            String avatarColor,
            int currentPoints,
            int totalEarned,
            boolean approved,
            Household household,
            User user
    ) {
        this.id = id;
        this.name = name;
        this.avatarColor = avatarColor;
        this.currentPoints = currentPoints;
        this.totalEarnedPoints = totalEarned;
        this.approved = approved;
        this.household = household;
        this.user = user;
    }

    public static Member createForUser(User user, String avatarColor) {
        return new Member(
                UUID.randomUUID().toString(),
                user.getUsername(),
                avatarColor,
                0,
                0,
                false,
                null,
                user
        );
    }

    public static Member createChild(String name, String avatarColor) {
        return new Member(
                UUID.randomUUID().toString(),
                name,
                avatarColor,
                0,
                0,
                false,
                null,
                null
        );
    }

    // getters & setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarColor() { return avatarColor; }
    public void setAvatarColor(String avatarColor) { this.avatarColor = avatarColor; }

    public int getCurrentPoints() { return currentPoints; }
    public void setCurrentPoints(int currentPoints) { this.currentPoints = currentPoints; }

    public int getTotalEarnedPoints() { return totalEarnedPoints; }
    public void setTotalEarnedPoints(int totalEarnedPoints) { this.totalEarnedPoints = totalEarnedPoints; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
