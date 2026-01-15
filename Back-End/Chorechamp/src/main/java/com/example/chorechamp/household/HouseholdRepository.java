package com.example.chorechamp.household;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HouseholdRepository extends JpaRepository<Household, String> {

    Optional<Household> findByInviteCode(String inviteCode);
}
