package com.example.chorechamp.household;
import com.example.chorechamp.member.Member;
import java.util.List;
import java.util.stream.Collectors;

import com.example.chorechamp.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/household-membership")
public class HouseholdMembershipController {

    private final HouseholdMembershipService membershipService;

    public HouseholdMembershipController(HouseholdMembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping("/{userId}/create")
    public ResponseEntity<CreateHouseholdResponse> createHouseholdForUser(
            @PathVariable String userId,
            @RequestBody CreateHouseholdRequest request
    ) {
        if (request == null || request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        CreateHouseholdResponse resp =
                membershipService.createHouseholdForUserAndPromoteAdmin(userId, request.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/{userId}/join")
    public ResponseEntity<HouseholdDto> joinHouseholdForUser(
            @PathVariable String userId,
            @RequestBody JoinHouseholdRequest request
    ) {
        if (request == null || request.getInviteCode() == null || request.getInviteCode().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        HouseholdDto dto = membershipService.joinHouseholdForUser(userId, request.getInviteCode());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{userId}/current")
    public ResponseEntity<HouseholdDto> getCurrentHouseholdForUser(@PathVariable String userId) {
        HouseholdDto dto = membershipService.getCurrentHouseholdForUser(userId);
        if (dto == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(dto);
    }

    // ---- Response DTO: household + updated user ----
    public static class CreateHouseholdResponse {
        private HouseholdDto household;
        private UserDto user;

        public CreateHouseholdResponse() {}

        public CreateHouseholdResponse(HouseholdDto household, UserDto user) {
            this.household = household;
            this.user = user;
        }

        public HouseholdDto getHousehold() { return household; }
        public void setHousehold(HouseholdDto household) { this.household = household; }

        public UserDto getUser() { return user; }
        public void setUser(UserDto user) { this.user = user; }
    }

    public static class UserDto {
        private String id;
        private String username;
        private String email;
        private String role; // "ADMIN" / "MEMBER"

        public UserDto() {}

        public UserDto(String id, String username, String email, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        public static UserDto from(User u) {
            return new UserDto(
                    u.getId(),
                    u.getUsername(),
                    u.getEmail(),
                    u.getRole() != null ? u.getRole().name() : null
            );
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // ---- Request DTOs ----
    public static class CreateHouseholdRequest {
        private String name;

        public CreateHouseholdRequest() {}
        public CreateHouseholdRequest(String name) { this.name = name; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class JoinHouseholdRequest {
        private String inviteCode;

        public JoinHouseholdRequest() {}
        public JoinHouseholdRequest(String inviteCode) { this.inviteCode = inviteCode; }

        public String getInviteCode() { return inviteCode; }
        public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }
    }
    @GetMapping("/{userId}/requests")
    public ResponseEntity<List<PendingMemberDto>> getPendingRequests(@PathVariable String userId) {
        List<Member> pending = membershipService.getPendingRequestsForAdmin(userId);

        List<PendingMemberDto> dtos = pending.stream()
                .map(PendingMemberDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{userId}/accept/{memberId}")
    public ResponseEntity<Void> acceptMember(
            @PathVariable String userId,
            @PathVariable String memberId
    ) {
        membershipService.acceptMember(userId, memberId);
        return ResponseEntity.ok().build();
    }

    // Kleine DTO zodat je niet hele Member entity exposed
    public static class PendingMemberDto {
        private String id;
        private String name;
        private String avatarColor;

        public PendingMemberDto() {}

        public PendingMemberDto(String id, String name, String avatarColor) {
            this.id = id;
            this.name = name;
            this.avatarColor = avatarColor;
        }

        public static PendingMemberDto fromEntity(Member m) {
            return new PendingMemberDto(m.getId(), m.getName(), m.getAvatarColor());
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getAvatarColor() { return avatarColor; }
        public void setAvatarColor(String avatarColor) { this.avatarColor = avatarColor; }
    }

}
