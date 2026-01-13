package com.example.chorechamp.member;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/members")
    public List<MemberDto> getAll() {
        return memberService.getAll();
    }

    @PostMapping("/members")
    public ResponseEntity<MemberDto> create(@RequestBody MemberDto dto) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        MemberDto created = memberService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/members/{id}")
    public ResponseEntity<MemberDto> update(
            @PathVariable String id,
            @RequestBody MemberDto dto
    ) {
        MemberDto updated = memberService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/members/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/households/{householdId}/members")
    public List<MemberDto> getAllForHousehold(@PathVariable String householdId) {
        return memberService.getAllForHousehold(householdId);
    }

    @PostMapping("/households/{householdId}/members")
    public ResponseEntity<MemberDto> createForHousehold(
            @PathVariable String householdId,
            @RequestBody MemberDto dto
    ) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        MemberDto created = memberService.createForHousehold(householdId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    @GetMapping("/members/by-user/{userId}")
    public ResponseEntity<MemberDto> getByUser(@PathVariable String userId) {
        MemberDto dto = memberService.getByUserId(userId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

}
