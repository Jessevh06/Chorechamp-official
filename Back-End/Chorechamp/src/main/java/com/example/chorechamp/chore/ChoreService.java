package com.example.chorechamp.chore;

import com.example.chorechamp.household.Household;
import com.example.chorechamp.household.HouseholdRepository;
import com.example.chorechamp.member.Member;
import com.example.chorechamp.member.MemberRepository;
import com.example.chorechamp.member.MemberService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChoreService {

    private final ChoreRepository repository;
    private final MemberService memberService;
    private final HouseholdRepository householdRepository;
    private final MemberRepository memberRepository;

    public ChoreService(
            ChoreRepository repository,
            MemberService memberService,
            HouseholdRepository householdRepository,
            MemberRepository memberRepository
    ) {
        this.repository = repository;
        this.memberService = memberService;
        this.householdRepository = householdRepository;
        this.memberRepository = memberRepository;
    }

    // ✅ Globaal weghalen uit UI, maar mag blijven bestaan
    public List<ChoreDto> getAll() {
        return repository.findAll().stream()
                .map(ChoreDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ Household scoped
    public List<ChoreDto> getAllForHousehold(String householdId) {
        return repository.findByHouseholdId(householdId).stream()
                .map(ChoreDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ Household scoped create
    public ChoreDto createForHousehold(String householdId, ChoreDto dto) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));

        Chore chore = Chore.createNew(dto.getTitle(), dto.getDescription(), dto.getPoints(), household);
        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }

    public ChoreDto update(String id, ChoreDto dto) {
        Chore chore = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chore not found"));

        chore.setTitle(dto.getTitle());
        chore.setDescription(dto.getDescription());
        chore.setPoints(dto.getPoints());
        chore.setDone(dto.isDone());
        chore.setPendingApproval(dto.isPendingApproval());
        chore.setAssignedMemberId(dto.getAssignedMemberId());

        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public ChoreDto claim(String choreId, String memberId) {
        Chore chore = repository.findById(choreId)
                .orElseThrow(() -> new RuntimeException("Chore not found"));

        if (chore.getAssignedMemberId() != null) {
            throw new RuntimeException("Chore is already assigned");
        }

        // ✅ extra check: member moet in hetzelfde huishouden zitten
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (member.getHousehold() == null || chore.getHousehold() == null ||
                !member.getHousehold().getId().equals(chore.getHousehold().getId())) {
            throw new RuntimeException("Member is not in the same household as this chore");
        }

        chore.setAssignedMemberId(memberId);
        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }

    public ChoreDto requestComplete(String choreId) {
        Chore chore = repository.findById(choreId)
                .orElseThrow(() -> new RuntimeException("Chore not found"));

        if (chore.isDone()) {
            throw new RuntimeException("Chore is already completed");
        }

        chore.setPendingApproval(true);
        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }

    public ChoreDto approve(String choreId) {
        Chore chore = repository.findById(choreId)
                .orElseThrow(() -> new RuntimeException("Chore not found"));

        if (!chore.isPendingApproval()) {
            throw new RuntimeException("Chore is not pending approval");
        }

        chore.setPendingApproval(false);
        chore.setDone(true);

        if (chore.getAssignedMemberId() != null) {
            memberService.awardPoints(chore.getAssignedMemberId(), chore.getPoints());
        }

        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }

    public ChoreDto claimByUser(String choreId, String userId) {
        Chore chore = repository.findById(choreId)
                .orElseThrow(() -> new RuntimeException("Chore not found"));

        if (chore.getAssignedMemberId() != null) {
            throw new RuntimeException("Chore is already assigned");
        }

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Member not found for user: " + userId));

        chore.setAssignedMemberId(member.getId());

        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }


}
