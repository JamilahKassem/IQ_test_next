'use client';
import {useEffect, useState} from 'react';
import { loginUser } from "prisma.ts";

export default function Login({ login, loading, debug })
{
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [failed, set_failed] = useState(0);
    useEffect(() =>
    {
        let messageTimeout;
        if (failed !== 0) {
            messageTimeout = setTimeout(() => {set_failed(0)}, 2000);
        }
        return () => clearTimeout(messageTimeout);
    }, [failed]);
    const handleLogin = (e) =>
    {
        e.preventDefault();
        if (userId === "" || password === "") {set_failed(1);return;}
        const fetchData = async () => {
            const userData = {userId: userId, password: password, isAdmin: isAdmin};
            if(debug)console.log("Logging request", userData)
            const user = await loginUser(userData);
            if (user === null) {set_failed(2);return;}
            login(user);
        };
        fetchData().then(() => {if (debug)console.log("fetch done")});
    };

    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <h2>Login</h2>
            {failed === 1 && (<p style={{ color: "red" }}>Please enter your ID and password.</p>)}
            {failed === 2 && (<p style={{ color: "red" }}>Login failed. Please check your ID and password.</p>)}
            <form onSubmit={handleLogin}>
                <input disabled={admin} placeholder="ID" value={userId} onChange={(e) => setUserId(e.target.value)}/>
                <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <label>Admin <input type={"checkbox"} checked={admin} onChange={(e) => setIsAdmin(e.target.checked)} /></label>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}