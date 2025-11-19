package com.example.chorechamp.chore;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chores")
@CrossOrigin(origins = "http://localhost:3000")
public class ChoreController {

    private final ChoreService service;

    public ChoreController(ChoreService service) {
        this.service = service;
    }

    @GetMapping
    public List<ChoreDto> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ChoreDto create(@RequestBody ChoreDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ChoreDto update(@PathVariable String id, @RequestBody ChoreDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/{id}/claim/{memberId}")
    public ChoreDto claim(@PathVariable String id, @PathVariable String memberId) {
        return service.claim(id, memberId);
    }

    @PostMapping("/{id}/complete")
    public ChoreDto requestComplete(@PathVariable String id) {
        return service.requestComplete(id);
    }

    @PostMapping("/{id}/approve")
    public ChoreDto approve(@PathVariable String id) {
        return service.approve(id);
    }
}
