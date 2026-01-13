package com.example.chorechamp.reward;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RewardController {

    private final RewardService service;

    public RewardController(RewardService service) {
        this.service = service;
    }

    @GetMapping("/households/{householdId}/rewards")
    public List<RewardDto> getAllForHousehold(@PathVariable String householdId) {
        return service.getAllForHousehold(householdId);
    }

    @PostMapping("/households/{householdId}/rewards")
    public RewardDto createForHousehold(@PathVariable String householdId, @RequestBody RewardDto dto) {
        return service.createForHousehold(householdId, dto);
    }

    @PutMapping("/rewards/{id}")
    public RewardDto update(@PathVariable String id, @RequestBody RewardDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/rewards/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
