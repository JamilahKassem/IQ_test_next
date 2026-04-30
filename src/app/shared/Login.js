'use client';
import {useEffect, useState} from 'react';
import {request} from "@/app/shared/connectHTTP";

export default function Login({ login, loading, debug })
{
    const [uid, setuid] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState(false);
    const [failed, set_failed] = useState(0);
    useEffect(() =>
    {
        let loginTimeout;
        if (failed !== 0) {
            loginTimeout = setTimeout(() => {set_failed(0)}, 2000);
        }
        return () => clearTimeout(loginTimeout);
    }, [failed]);
    const handleLogin = (e) =>
    {
        e.preventDefault();
        if ((uid === "" && !admin) || password === "") {set_failed(1);return;}
        const fetchData = async () => {
            try {
                const userData = {uid: uid, password: password, admin: admin};
                if(debug)console.log("Logging request", userData)
                let data = await request(`login`,debug,false,userData);
                if (data.success){
                    if(admin){
                        login({name: data.Name, uid: 0, school: data.School, admin: true});
                    }else{
                        login({name: data.Name, uid: uid, school: data.School, admin: false});
                    }
                }else{
                    set_failed(2);
                }
            } catch (err) {}
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
                <input disabled={admin} placeholder="ID" value={uid} onChange={(e) => setuid(e.target.value)}/>
                <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <label>Admin <input type={"checkbox"} checked={admin} onChange={(e) => setAdmin(e.target.checked)} /></label>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}