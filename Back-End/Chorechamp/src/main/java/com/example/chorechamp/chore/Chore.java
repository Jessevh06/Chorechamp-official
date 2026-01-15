package com.example.chorechamp.chore;

import com.example.chorechamp.household.Household;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "chores")
public class Chore {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private int points;

    @Column(nullable = false)
    private boolean done;

    @Column(nullable = false)
    private boolean pendingApproval;

    @Column
    private String assignedMemberId;

    @ManyToOne
    @JoinColumn(name = "household_id")
    private Household household;

    public Chore() {}

    public Chore(
            String id,
            String title,
            String description,
            int points,
            boolean done,
            boolean pendingApproval,
            String assignedMemberId,
            Household household
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.points = points;
        this.done = done;
        this.pendingApproval = pendingApproval;
        this.assignedMemberId = assignedMemberId;
        this.household = household;
    }

    public static Chore createNew(String title, String description, int points, Household household) {
        return new Chore(
                UUID.randomUUID().toString(),
                title,
                description,
                points,
                false,
                false,
                null,
                household
        );
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public boolean isPendingApproval() { return pendingApproval; }
    public void setPendingApproval(boolean pendingApproval) { this.pendingApproval = pendingApproval; }

    public String getAssignedMemberId() { return assignedMemberId; }
    public void setAssignedMemberId(String assignedMemberId) { this.assignedMemberId = assignedMemberId; }

    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
}
