package com.example.chorechamp.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService service;

    @Test
    void register_throws_when_email_already_in_use() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@test.com");
        req.setUsername("john");
        req.setPassword("pw");

        when(repository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(mock(User.class)));

        // Act
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.register(req));

        // Assert
        assertEquals("Email already in use", ex.getMessage());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void login_returns_userdto_when_password_matches() {
        // Arrange
        LoginRequest req = new LoginRequest();
        req.setIdentifier("test@test.com");
        req.setPassword("pw");

        User user = mock(User.class);
        when(user.getPassword()).thenReturn("HASH");
        when(user.getId()).thenReturn("u1");
        when(user.getUsername()).thenReturn("john");
        when(user.getEmail()).thenReturn("test@test.com");
        when(user.getRole()).thenReturn(UserRole.ADMIN); // mag ook MEMBER

        when(repository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pw", "HASH")).thenReturn(true);

        // Act
        UserDto dto = service.login(req);

        // Assert
        assertNotNull(dto);
        assertEquals("u1", dto.getId());
        assertEquals("john", dto.getUsername());
        assertEquals("test@test.com", dto.getEmail());
        verify(passwordEncoder).matches("pw", "HASH");
    }
}
