package com.example.chorechamp.chore;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChoreRepository extends JpaRepository<Chore, String> {

}
