package com.example.chorechamp.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerApplicationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @Test
    void register_returns_200_and_user_json() throws Exception {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@test.com");
        req.setUsername("john");
        req.setPassword("pw");

        UserDto resp = new UserDto("u1", "john", "test@test.com", "MEMBER");
        when(authService.register(any(RegisterRequest.class))).thenReturn(resp);

        // Act + Assert
        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("u1"))
                .andExpect(jsonPath("$.username").value("john"))
                .andExpect(jsonPath("$.email").value("test@test.com"));

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    void login_returns_200_and_user_json() throws Exception {
        // Arrange
        LoginRequest req = new LoginRequest();
        req.setIdentifier("john");
        req.setPassword("pw");

        UserDto resp = new UserDto("u1", "john", "john@test.com", "ADMIN");
        when(authService.login(any(LoginRequest.class))).thenReturn(resp);

        // Act + Assert
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));

        verify(authService).login(any(LoginRequest.class));
    }
}
