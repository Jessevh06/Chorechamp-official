package com.example.chorechamp.user;

import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AdminInitializer {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initAdmin() {
        if (repository.findByUsername("admin").isPresent()) {
            return; // admin bestaat al
        }

        String hashed = passwordEncoder.encode("admin");

        User admin = new User(
                UUID.randomUUID().toString(),
                "admin",
                "admin@example.com",
                hashed,
                UserRole.ADMIN
        );

        repository.save(admin);
    }
}

