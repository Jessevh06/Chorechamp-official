package com.example.chorechamp.reward;

public class RewardDto {

    private String id;
    private String name;
    private int cost;          // zelfde naam als frontend
    private String description;

    public RewardDto() {
    }

    public RewardDto(String id, String name, int cost, String description) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.description = description;
    }

    public static RewardDto fromEntity(Reward reward) {
        return new RewardDto(
                reward.getId(),
                reward.getName(),
                reward.getCostPoints(),   // DB -> DTO
                reward.getDescription()
        );
    }

    public Reward toEntity() {
        return new Reward(
                id,
                name,
                description,
                cost                       // DTO -> DB
        );
    }

    // getters & setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCost() { return cost; }
    public void setCost(int cost) { this.cost = cost; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
