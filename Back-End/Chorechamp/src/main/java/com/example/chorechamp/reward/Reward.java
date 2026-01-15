package com.example.chorechamp.reward;

import com.example.chorechamp.household.Household;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "rewards")
public class Reward {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private int costPoints;

    @ManyToOne
    @JoinColumn(name = "household_id")
    private Household household;

    public Reward() {}

    public Reward(String id, String name, String description, int costPoints, Household household) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.costPoints = costPoints;
        this.household = household;
    }

    public static Reward createNew(String name, String description, int costPoints, Household household) {
        return new Reward(
                UUID.randomUUID().toString(),
                name,
                description,
                costPoints,
                household
        );
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getCostPoints() { return costPoints; }
    public void setCostPoints(int costPoints) { this.costPoints = costPoints; }

    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
}
