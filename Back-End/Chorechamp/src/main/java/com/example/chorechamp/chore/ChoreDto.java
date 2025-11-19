package com.example.chorechamp.chore;

public class ChoreDto {

    private String id;
    private String title;
    private String description;
    private int points;
    private boolean done;
    private boolean pendingApproval;
    private String assignedMemberId;

    public ChoreDto() {
    }

    public ChoreDto(String id, String title, String description, int points,
                    boolean done, boolean pendingApproval, String assignedMemberId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.points = points;
        this.done = done;
        this.pendingApproval = pendingApproval;
        this.assignedMemberId = assignedMemberId;
    }

    public static ChoreDto fromEntity(Chore chore) {
        return new ChoreDto(
                chore.getId(),
                chore.getTitle(),
                chore.getDescription(),
                chore.getPoints(),
                chore.isDone(),
                chore.isPendingApproval(),
                chore.getAssignedMemberId()
        );
    }

    public Chore toEntity() {
        return new Chore(id, title, description, points, done, pendingApproval, assignedMemberId);
    }

    // getters & setters

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
}
