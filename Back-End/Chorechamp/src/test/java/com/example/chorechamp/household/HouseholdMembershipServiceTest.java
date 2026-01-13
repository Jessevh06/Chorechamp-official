package com.example.chorechamp.household;

import com.example.chorechamp.member.Member;
import com.example.chorechamp.member.MemberRepository;
import com.example.chorechamp.user.User;
import com.example.chorechamp.user.UserRepository;
import com.example.chorechamp.user.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HouseholdMembershipServiceTest {

    private HouseholdService householdService;
    private HouseholdRepository householdRepository;
    private MemberRepository memberRepository;
    private UserRepository userRepository;

    private HouseholdMembershipService service;

    @BeforeEach
    void setup() {
        householdService = mock(HouseholdService.class);
        householdRepository = mock(HouseholdRepository.class);
        memberRepository = mock(MemberRepository.class);
        userRepository = mock(UserRepository.class);

        service = new HouseholdMembershipService(
                householdService, householdRepository, memberRepository, userRepository
        );
    }

    @Test
    void createHousehold_promotes_user_to_admin_and_links_member_to_household() {
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn("u1");

        when(userRepository.findById("u1")).thenReturn(Optional.of(user));

        HouseholdDto householdDto = new HouseholdDto();
        householdDto.setId("h1");
        when(householdService.create("Test")).thenReturn(householdDto);

        Household household = mock(Household.class);
        when(householdRepository.findById("h1")).thenReturn(Optional.of(household));

        Member member = mock(Member.class);
        when(memberRepository.findByUserId("u1")).thenReturn(Optional.of(member));

        // Act
        HouseholdMembershipController.CreateHouseholdResponse resp =
                service.createHouseholdForUserAndPromoteAdmin("u1", "Test");

        // Assert
        assertNotNull(resp);
        verify(member).setHousehold(household);
        verify(memberRepository).save(member);
        verify(user).setRole(UserRole.ADMIN);
        verify(userRepository).save(user);
    }
}
