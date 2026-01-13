package com.example.chorechamp.reward;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RewardServiceTest {

    private RewardRepository repository;
    private RewardService service;

    @BeforeEach
    void setup() {
        repository = mock(RewardRepository.class);
        service = new RewardService(repository);
    }

    @Test
    void update_updates_fields_and_saves() {
        // Arrange
        Reward reward = mock(Reward.class);
        when(repository.findById("r1")).thenReturn(Optional.of(reward));
        when(repository.save(reward)).thenReturn(reward);

        RewardDto dto = new RewardDto();
        dto.setName("Nieuwe naam");
        dto.setDescription("Nieuwe beschrijving");
        dto.setCost(50);

        // Act
        RewardDto result = service.update("r1", dto);

        // Assert
        assertNotNull(result);
        verify(reward).setName("Nieuwe naam");
        verify(reward).setDescription("Nieuwe beschrijving");
        verify(reward).setCostPoints(50);
        verify(repository).save(reward);
    }
}
