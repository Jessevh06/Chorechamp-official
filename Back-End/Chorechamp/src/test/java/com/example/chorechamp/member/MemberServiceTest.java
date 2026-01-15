package com.example.chorechamp.member;

import com.example.chorechamp.household.HouseholdRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MemberServiceTest {

    private MemberRepository repository;
    private HouseholdRepository householdRepository;
    private MemberService service;

    @BeforeEach
    void setup() {
        repository = mock(MemberRepository.class);
        householdRepository = mock(HouseholdRepository.class);
        service = new MemberService(repository, householdRepository);
    }

    @Test
    void awardPoints_increases_current_and_total_points() {
        // Arrange
        Member member = mock(Member.class);
        when(repository.findById("m1")).thenReturn(Optional.of(member));
        when(member.getCurrentPoints()).thenReturn(5);
        when(member.getTotalEarnedPoints()).thenReturn(20);

        when(repository.save(member)).thenReturn(member);

        // Act
        MemberDto dto = service.awardPoints("m1", 10);

        // Assert
        assertNotNull(dto);
        verify(member).setCurrentPoints(15);
        verify(member).setTotalEarnedPoints(30);
        verify(repository).save(member);
    }
}
