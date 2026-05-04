'use client';

import { useEffect, useState, type SubmitEvent, type ChangeEvent } from 'react';
// IMPORTANT: Ensure this import points to a file with "use server" at the top
import { loginUser } from "./prisma";

interface User {
    id: number;
    name: string;
    school: string;
    isAdmin: boolean;
}

interface LoginProps {
    login: (user: User) => void;
    loading: boolean;
    debug?: boolean;
}

export default function Login({ login, loading, debug }: LoginProps) {
    // 1. Initialize state with proper types
    const [userId, setUserId] = useState<number | "" | null>(null);
    const [password, setPassword] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [failed, setFailed] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        let messageTimeout: NodeJS.Timeout;
        if (failed) {
            messageTimeout = setTimeout(() => {
                setFailed(false);
            }, 2000);
        }
        return () => clearTimeout(messageTimeout);
    }, [failed]);

    // 2. Type the event as SubmitEvent
    const handleLogin = (e: SubmitEvent) => {
        e.preventDefault();

        if (userId === null || userId === "" || password === "") {
            setErrorMessage("Please Enter id and password");
            setFailed(true);
            return;
        }

        const fetchData = async () => {
            const userData = { userId: Number(userId), password: password, isAdmin: isAdmin };

            if (debug) console.log("Logging request", userData);

            try {
                const user = await loginUser(userData) as User;
                user.isAdmin = isAdmin;
                login(user);
            } catch (error) {
                if (debug) console.error("Login error:", error);
                const message = error instanceof Error
                    ? error.message
                    : String(error);
                setErrorMessage(message);
                setFailed(true);
            }
        };

        fetchData().then(() => {
            if (debug) console.log("fetch done");
        });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="text-3xl font-bold underline text-blue-600">
            <h2>Login</h2>
            {failed && (<p style={{ color: "red" }}>{errorMessage}</p>)}

            <form onSubmit={handleLogin}>
                <input
                    type="number"
                    placeholder="ID"
                    value={userId ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        setUserId(val === "" ? "" : parseInt(val, 10));
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <label>
                    Admin
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setIsAdmin(e.target.checked)}
                    />
                </label>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}