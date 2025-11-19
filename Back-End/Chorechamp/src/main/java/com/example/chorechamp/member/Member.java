package com.example.chorechamp.member;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.util.UUID;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    // bijv. hex kleurcode voor avatar ("#F97316"), pas aan als jij iets anders gebruikt
    @Column(length = 20)
    private String avatarColor;

    @Column(nullable = false)
    private int currentPoints;

    @Column(nullable = false)
    private int totalEarnedPoints;

    public Member() {
        // verplicht voor JPA
    }

    public Member(String id, String name, String avatarColor,
                  int currentPoints, int totalEarnedPoints) {
        this.id = id;
        this.name = name;
        this.avatarColor = avatarColor;
        this.currentPoints = currentPoints;
        this.totalEarnedPoints = totalEarnedPoints;
    }

    public static Member createNew(String name, String avatarColor) {
        return new Member(
                UUID.randomUUID().toString(),
                name,
                avatarColor,
                0,
                0
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
}
