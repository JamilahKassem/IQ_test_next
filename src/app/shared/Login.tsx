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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <h2 className="text-3xl font-extrabold text-slate-800 mb-6 text-center tracking-tight">
                    IQ Test Login
                </h2>

                {failed && (
                    <div className="mb-4 p-3 rounded bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600 text-center font-medium">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="number"
                            placeholder="User ID"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                            value={userId ?? ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setUserId(val === "" ? "" : parseInt(val, 10));
                            }}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-sm font-medium">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                checked={isAdmin}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setIsAdmin(e.target.checked)}
                            />
                            Admin Access
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:transform active:scale-[0.98]"
                    >
                        Start Assessment
                    </button>
                </form>
            </div>
        </div>
    );
}