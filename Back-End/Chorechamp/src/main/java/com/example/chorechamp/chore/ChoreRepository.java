package com.example.chorechamp.chore;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoreRepository extends JpaRepository<Chore, String> {

    List<Chore> findByHouseholdId(String householdId);
}
