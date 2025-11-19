package com.example.chorechamp.user;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    // hier komt straks de BCrypt-hash in
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    public User() {
    }

    public User(String id, String username, String email, String password, UserRole role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static User createNewMember(String username, String email, String hashedPassword) {
        return new User(
                UUID.randomUUID().toString(),
                username,
                email,
                hashedPassword,
                UserRole.MEMBER
        );
    }

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
