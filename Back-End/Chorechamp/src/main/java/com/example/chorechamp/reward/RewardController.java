package com.example.chorechamp.reward;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@CrossOrigin(origins = "http://localhost:3000")
public class RewardController {

    private final RewardService service;

    public RewardController(RewardService service) {
        this.service = service;
    }

    @GetMapping
    public List<RewardDto> getAll() {
        return service.getAll();
    }

    @PostMapping
    public RewardDto create(@RequestBody RewardDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public RewardDto update(@PathVariable String id, @RequestBody RewardDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
