package com.example.chorechamp.member;

import com.example.chorechamp.household.Household;
import com.example.chorechamp.household.HouseholdRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository repository;
    private final HouseholdRepository householdRepository;

    public MemberService(MemberRepository repository,
                         HouseholdRepository householdRepository) {
        this.repository = repository;
        this.householdRepository = householdRepository;
    }

    public List<MemberDto> getAll() {
        return repository.findAll().stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MemberDto> getAllForHousehold(String householdId) {
        return repository.findByHouseholdIdAndApprovedTrue(householdId).stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MemberDto> getPendingForHousehold(String householdId) {
        return repository.findByHouseholdIdAndApprovedFalse(householdId).stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
    }

    public MemberDto create(MemberDto dto) {
        String avatarColor = dto.getAvatarColor() != null && !dto.getAvatarColor().isBlank()
                ? dto.getAvatarColor()
                : "#22c55e";

        Member member = Member.createChild(dto.getName(), avatarColor);
        member.setApproved(true);

        Member saved = repository.save(member);
        return MemberDto.fromEntity(saved);
    }

    public MemberDto createForHousehold(String householdId, MemberDto dto) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));

        String avatarColor = dto.getAvatarColor() != null && !dto.getAvatarColor().isBlank()
                ? dto.getAvatarColor()
                : "#22c55e";

        Member member = Member.createChild(dto.getName(), avatarColor);
        member.setHousehold(household);
        member.setApproved(true);

        Member saved = repository.save(member);
        return MemberDto.fromEntity(saved);
    }

    public MemberDto update(String id, MemberDto dto) {
        Member member = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setName(dto.getName());
        member.setAvatarColor(dto.getAvatarColor());
        member.setCurrentPoints(dto.getCurrentPoints());
        member.setTotalEarnedPoints(dto.getTotalEarnedPoints());

        Member saved = repository.save(member);
        return MemberDto.fromEntity(saved);
    }

    public MemberDto awardPoints(String memberId, int points) {
        Member member = repository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setCurrentPoints(member.getCurrentPoints() + points);
        member.setTotalEarnedPoints(member.getTotalEarnedPoints() + points);

        Member saved = repository.save(member);
        return MemberDto.fromEntity(saved);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public MemberDto getByUserId(String userId) {
        return repository.findByUserId(userId)
                .map(MemberDto::fromEntity)
                .orElse(null);
    }
    public Member getMemberEntityByUserId(String userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Member not found for user: " + userId));
    }

}
