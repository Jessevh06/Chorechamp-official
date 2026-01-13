package com.example.chorechamp.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    // household.id
    List<Member> findByHouseholdId(String householdId);

    List<Member> findByHouseholdIdAndApprovedTrue(String householdId);

    List<Member> findByHouseholdIdAndApprovedFalse(String householdId);

    // user.id
    Optional<Member> findByUserId(String userId);
}
