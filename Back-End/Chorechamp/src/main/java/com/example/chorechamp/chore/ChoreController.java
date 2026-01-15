package com.example.chorechamp.chore;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChoreController {

    private final ChoreService service;

    public ChoreController(ChoreService service) {
        this.service = service;
    }

    // ✅ Household scoped
    @GetMapping("/households/{householdId}/chores")
    public List<ChoreDto> getAllForHousehold(@PathVariable String householdId) {
        return service.getAllForHousehold(householdId);
    }

    @PostMapping("/households/{householdId}/chores")
    public ChoreDto createForHousehold(@PathVariable String householdId, @RequestBody ChoreDto dto) {
        return service.createForHousehold(householdId, dto);
    }

    // (optioneel) laat globale endpoint bestaan, maar UI moet hem niet gebruiken
    @GetMapping("/chores")
    public List<ChoreDto> getAll() {
        return service.getAll();
    }

    @PutMapping("/chores/{id}")
    public ChoreDto update(@PathVariable String id, @RequestBody ChoreDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/chores/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/chores/{id}/claim/{memberId}")
    public ChoreDto claim(@PathVariable String id, @PathVariable String memberId) {
        return service.claim(id, memberId);
    }

    @PostMapping("/chores/{id}/complete")
    public ChoreDto requestComplete(@PathVariable String id) {
        return service.requestComplete(id);
    }

    @PostMapping("/chores/{id}/approve")
    public ChoreDto approve(@PathVariable String id) {
        return service.approve(id);
    }

    @PostMapping("/chores/{id}/claim-by-user/{userId}")
    public ChoreDto claimByUser(@PathVariable String id, @PathVariable String userId) {
        return service.claimByUser(id, userId);
    }



}
