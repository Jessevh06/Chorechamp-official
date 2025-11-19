// src/lib/api/authApi.ts

export type User = {
    id: string;
    username: string;
    email: string;
    role: "ADMIN" | "MEMBER";
};

const BASE_URL = "http://localhost:8080/api/auth";

export async function login(identifier: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Login failed:", res.status, text);
        throw new Error("Login failed");
    }

    return res.json();
}

export async function register(input: {
    email: string;
    username: string;
    password: string;
}): Promise<User> {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Register failed:", res.status, text);
        throw new Error("Register failed");
    }

    return res.json();
}
