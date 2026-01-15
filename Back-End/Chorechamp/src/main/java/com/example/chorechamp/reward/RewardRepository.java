package com.example.chorechamp.reward;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, String> {

    List<Reward> findByHouseholdId(String householdId);
}
