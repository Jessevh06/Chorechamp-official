package com.example.chorechamp.chore;
import com.example.chorechamp.leaderboard.LeaderboardPublisher;

import com.example.chorechamp.leaderboard.LeaderboardPublisher;
import com.example.chorechamp.member.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ChoreServiceTest {

    private ChoreRepository repository;
    private MemberService memberService;
    private ChoreService service;
    private LeaderboardPublisher leaderboardPublisher;


    @BeforeEach
    void setup() {
        repository = mock(ChoreRepository.class);
        memberService = mock(MemberService.class);
        leaderboardPublisher = mock(LeaderboardPublisher.class);
        service = new ChoreService(repository, memberService, leaderboardPublisher);
    }

    @Test
    void claim_sets_assignedMemberId_when_unassigned() {
        // Arrange
        Chore chore = mock(Chore.class);
        when(repository.findById("c1")).thenReturn(Optional.of(chore));
        when(chore.getAssignedMemberId()).thenReturn(null);
        when(repository.save(chore)).thenReturn(chore);

        // Act
        ChoreDto dto = service.claim("c1", "m1");

        // Assert
        assertNotNull(dto);
        verify(chore).setAssignedMemberId("m1");
        verify(repository).save(chore);
    }

    @Test
    void approve_awards_points_when_pending_and_assigned() {
        // Arrange
        Chore chore = mock(Chore.class);
        when(repository.findById("c1")).thenReturn(Optional.of(chore));
        when(chore.isPendingApproval()).thenReturn(true);
        when(chore.getAssignedMemberId()).thenReturn("m1");
        when(chore.getPoints()).thenReturn(10);
        when(repository.save(chore)).thenReturn(chore);

        // Act
        ChoreDto dto = service.approve("c1");

        // Assert
        assertNotNull(dto);
        verify(chore).setPendingApproval(false);
        verify(chore).setDone(true);
        verify(memberService).awardPoints("m1", 10);
    }
}
