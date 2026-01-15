package com.example.chorechamp.leaderboard;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LeaderboardPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public LeaderboardPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishLeaderboardUpdated(String householdId) {
        messagingTemplate.convertAndSend(
                "/topic/leaderboard/" + householdId,
                Map.of("type", "LEADERBOARD_UPDATED", "householdId", householdId)
        );
    }
}
