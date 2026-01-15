package com.example.chorechamp.household;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "households")
public class Household {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 32)
    private String inviteCode;

    public Household() {
        // voor JPA
    }

    public Household(String id, String name, String inviteCode) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
    }

    public static Household createNew(String name, String inviteCode) {
        return new Household(
                UUID.randomUUID().toString(),
                name,
                inviteCode
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
