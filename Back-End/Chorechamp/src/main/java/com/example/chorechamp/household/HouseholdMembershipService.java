package com.example.chorechamp.household;

import com.example.chorechamp.member.Member;
import com.example.chorechamp.member.MemberRepository;
import com.example.chorechamp.user.UserRole;
import com.example.chorechamp.user.User;
import com.example.chorechamp.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HouseholdMembershipService {

    private final HouseholdService householdService;
    private final HouseholdRepository householdRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    public HouseholdMembershipService(HouseholdService householdService,
                                      HouseholdRepository householdRepository,
                                      MemberRepository memberRepository,
                                      UserRepository userRepository) {
        this.householdService = householdService;
        this.householdRepository = householdRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public HouseholdMembershipController.CreateHouseholdResponse createHouseholdForUserAndPromoteAdmin(
            String userId,
            String householdName
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        HouseholdDto householdDto = householdService.create(householdName);

        Household household = householdRepository.findById(householdDto.getId())
                .orElseThrow(() -> new RuntimeException("Household not found after create"));

        Member member = memberRepository.findByUserId(user.getId())
                .orElseGet(() -> Member.createForUser(user, "#f97316"));

        member.setHousehold(household);
        member.setApproved(true);
        memberRepository.save(member);

        user.setRole(UserRole.ADMIN);
        userRepository.save(user);

        return new HouseholdMembershipController.CreateHouseholdResponse(
                householdDto,
                HouseholdMembershipController.UserDto.from(user)
        );
    }

    @Transactional
    public HouseholdDto joinHouseholdForUser(String userId, String inviteCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Household household = householdRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        Member member = memberRepository.findByUserId(user.getId())
                .orElseGet(() -> Member.createForUser(user, "#22c55e"));

        member.setHousehold(household);
        member.setApproved(false); // pending
        memberRepository.save(member);

        user.setRole(UserRole.MEMBER);
        userRepository.save(user);

        return HouseholdDto.fromEntity(household);
    }

    @Transactional(readOnly = true)
    public HouseholdDto getCurrentHouseholdForUser(String userId) {
        if (userId == null || userId.isBlank()) return null;

        return userRepository.findById(userId)
                .flatMap(u -> memberRepository.findByUserId(u.getId()))
                .map(Member::getHousehold)
                .map(h -> h != null ? HouseholdDto.fromEntity(h) : null)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Member> getPendingRequestsForAdmin(String adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + adminUserId));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Forbidden: ADMIN only");
        }

        Member adminMember = memberRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new RuntimeException("Admin member record not found"));

        if (adminMember.getHousehold() == null) {
            throw new RuntimeException("Admin is not in a household");
        }

        String householdId = adminMember.getHousehold().getId();
        return memberRepository.findByHouseholdIdAndApprovedFalse(householdId);
    }

    @Transactional
    public void acceptMember(String adminUserId, String memberIdToAccept) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + adminUserId));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Forbidden: ADMIN only");
        }

        Member adminMember = memberRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new RuntimeException("Admin member record not found"));

        if (adminMember.getHousehold() == null) {
            throw new RuntimeException("Admin is not in a household");
        }

        String householdId = adminMember.getHousehold().getId();

        Member toAccept = memberRepository.findById(memberIdToAccept)
                .orElseThrow(() -> new RuntimeException("Member not found: " + memberIdToAccept));

        if (toAccept.getHousehold() == null || !toAccept.getHousehold().getId().equals(householdId)) {
            throw new RuntimeException("Member is not in your household");
        }

        toAccept.setApproved(true);
        memberRepository.save(toAccept);
    }
}
