package com.example.chorechamp.member;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @GetMapping
    public List<MemberDto> getAll() {
        return service.getAll();
    }

    @PostMapping
    public MemberDto create(@RequestBody MemberDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public MemberDto update(@PathVariable String id, @RequestBody MemberDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/{id}/award")
    public MemberDto awardPoints(
            @PathVariable String id,
            @RequestBody MemberPointsRequest request
    ) {
        return service.awardPoints(id, request.getPoints());
    }

}
