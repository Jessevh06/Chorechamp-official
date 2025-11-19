package com.example.chorechamp.reward;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    private final RewardRepository repository;

    public RewardService(RewardRepository repository) {
        this.repository = repository;
    }

    public List<RewardDto> getAll() {
        return repository.findAll().stream()
                .map(RewardDto::fromEntity)
                .collect(Collectors.toList());
    }

    public RewardDto create(RewardDto dto) {
        Reward reward = Reward.createNew(
                dto.getName(),
                dto.getDescription(),
                dto.getCost()
        );
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
