package com.example.chorechamp.household;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class HouseholdService {

    private final HouseholdRepository repository;
    private final SecureRandom secureRandom = new SecureRandom();

    public HouseholdService(HouseholdRepository repository) {
        this.repository = repository;
    }

    public List<HouseholdDto> getAll() {
        return repository.findAll().stream()
                .map(HouseholdDto::fromEntity)
                .collect(Collectors.toList());
    }

    public HouseholdDto getById(String id) {
        Household household = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Household not found"));
        return HouseholdDto.fromEntity(household);
    }

    public HouseholdDto create(String name) {
        String inviteCode = generateInviteCode();
        Household household = Household.createNew(name, inviteCode);
        Household saved = repository.save(household);
        return HouseholdDto.fromEntity(saved);
    }

    public HouseholdDto findByInviteCode(String inviteCode) {
        Household household = repository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Household not found for invite code"));
        return HouseholdDto.fromEntity(household);
    }

    private String generateInviteCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // geen 0/O/I om verwarring te voorkomen
        int length = 6;

        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = secureRandom.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString().toUpperCase(Locale.ROOT);
    }

    public HouseholdDto getCurrentHouseholdForUser(String userId) {
        if (userId == null || userId.isBlank()) return null;
        return null;
    }
}
