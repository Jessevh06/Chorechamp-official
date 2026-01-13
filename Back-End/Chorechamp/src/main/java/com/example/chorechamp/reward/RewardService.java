package com.example.chorechamp.reward;

import com.example.chorechamp.household.Household;
import com.example.chorechamp.household.HouseholdRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    private final RewardRepository repository;
    private final HouseholdRepository householdRepository;

    public RewardService(RewardRepository repository, HouseholdRepository householdRepository) {
        this.repository = repository;
        this.householdRepository = householdRepository;
    }

    // household scoped
    public List<RewardDto> getAllForHousehold(String householdId) {
        return repository.findByHouseholdId(householdId).stream()
                .map(RewardDto::fromEntity)
                .collect(Collectors.toList());
    }

    // household scoped create
    public RewardDto createForHousehold(String householdId, RewardDto dto) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));

        Reward reward = Reward.createNew(dto.getName(), dto.getDescription(), dto.getCost(), household);
        Reward saved = repository.save(reward);
        return RewardDto.fromEntity(saved);
    }

    public RewardDto update(String id, RewardDto dto) {
        Reward reward = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        reward.setName(dto.getName());
        reward.setDescription(dto.getDescription());
        reward.setCostPoints(dto.getCost());

        Reward saved = repository.save(reward);
        return RewardDto.fromEntity(saved);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
