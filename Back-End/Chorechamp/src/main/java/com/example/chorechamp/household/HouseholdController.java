package com.example.chorechamp.household;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}

)
@RestController
@RequestMapping("/api/households")
public class HouseholdController {

    private final HouseholdService householdService;
    private final HouseholdMembershipService householdMembershipService;

    public HouseholdController(HouseholdService householdService,
                               HouseholdMembershipService householdMembershipService) {
        this.householdService = householdService;
        this.householdMembershipService = householdMembershipService;
    }

    @GetMapping
    public List<HouseholdDto> getAll() {
        return householdService.getAll();
    }

    @GetMapping("/{id}")
    public HouseholdDto getById(@PathVariable String id) {
        return householdService.getById(id);
    }

    @PostMapping
    public ResponseEntity<HouseholdDto> create(@RequestBody CreateHouseholdRequest request) {
        if (request == null || request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        HouseholdDto created = householdService.create(request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/by-code/{inviteCode}")
    public HouseholdDto getByInviteCode(@PathVariable String inviteCode) {
        return householdService.findByInviteCode(inviteCode);
    }

    /**
     * Haalt het huidige huishouden op voor een user.
     * Frontend: GET /api/households/current?userId=...
     */
    @GetMapping("/current")
    public ResponseEntity<HouseholdDto> getCurrent(@RequestParam String userId) {
        HouseholdDto dto = householdMembershipService.getCurrentHouseholdForUser(userId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    public static class CreateHouseholdRequest {
        private String name;

        public CreateHouseholdRequest() {}

        public CreateHouseholdRequest(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
