package com.example.chorechamp.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto register(RegisterRequest request) {
        // simpele uniqueness-checks
        repository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already in use");
        });
        repository.findByUsername(request.getUsername()).ifPresent(u -> {
            throw new RuntimeException("Username already in use");
        });

        // wachtwoord hashen
        String hashed = passwordEncoder.encode(request.getPassword());

        User user = User.createNewMember(
                request.getUsername(),
                request.getEmail(),
                hashed
        );

        User saved = repository.save(user);
        return UserDto.fromEntity(saved);
    }

    public UserDto login(LoginRequest request) {
        User user = repository.findByEmail(request.getIdentifier())
                .or(() -> repository.findByUsername(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return UserDto.fromEntity(user);
    }
}
