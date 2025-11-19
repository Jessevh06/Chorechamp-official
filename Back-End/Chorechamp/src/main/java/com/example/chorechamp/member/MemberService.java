package com.example.chorechamp.member;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository repository;

    public MemberService(MemberRepository repository) {
        this.repository = repository;
    }

    public List<MemberDto> getAll() {
        return repository.findAll().stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
    }

    public MemberDto create(MemberDto dto) {
        // Als je nog geen avatarColor uit de frontend krijgt,
        // geef hier een default mee, bv. "#22c55e"
        String avatarColor = dto.getAvatarColor() != null
                ? dto.getAvatarColor()
                : "#22c55e";

        Member member = Member.createNew(dto.getName(), avatarColor);
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

    // Optioneel: punten toekennen (wordt door ChoreService gebruikt)
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
}
