'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import React from "react";

interface AuthProviderProps {
    children: React.ReactNode;
}
interface User {
    id: number;
    name: string;
    school?: string;
    isAdmin: boolean;
}

// 1. Define the shape of the Context
interface AuthContextType {
    user: User | null | undefined;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

// 2. Initialize with undefined or null, but cast to the type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // Explicitly allow User, null (logged out), or undefined (initial state)
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        console.log("Logging in", userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Add a null-check in the hook for better DX
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};