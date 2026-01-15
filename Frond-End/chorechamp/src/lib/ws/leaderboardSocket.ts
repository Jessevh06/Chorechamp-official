import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type OnMessage = (payload: unknown) => void;

export function connectLeaderboardSocket(
    householdId: number | string,
    onMessage: OnMessage
) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // bv http://localhost:8080
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
    }

    const client = new Client({
        webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
        reconnectDelay: 3000,
        onConnect: () => {
            client.subscribe(`/topic/leaderboard/${householdId}`, (msg) => {
                try {
                    const payload = JSON.parse(msg.body);
                    onMessage(payload);
                } catch (e) {
                    console.error("Invalid WS message", e);
                }
            });
        },
        onStompError: (frame) => {
            console.error("Broker error", frame.headers["message"], frame.body);
        },
    });

    client.activate();

    return () => {
        client.deactivate();
    };
}

