package com.example.chorechamp.chore;

import com.example.chorechamp.member.MemberService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChoreService {

    private final ChoreRepository repository;
    private final MemberService memberService;

    public ChoreService(ChoreRepository repository, MemberService memberService) {
        this.repository = repository;
        this.memberService = memberService;
    }

    public List<ChoreDto> getAll() {
        return repository.findAll().stream()
                .map(ChoreDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ChoreDto create(ChoreDto dto) {
        Chore chore = Chore.createNew(dto.getTitle(), dto.getDescription(), dto.getPoints());
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

        chore.setAssignedMemberId(memberId);
        Chore saved = repository.save(chore);
        return ChoreDto.fromEntity(saved);
    }

    // Lid vraagt afronding aan -> pendingApproval = true, done blijft false
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

    // Huishoudhoofd keurt goed -> done = true, pendingApproval = false, punten toekennen
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
}
