'use client';

import Question from "./shared/Question";
import ConnectSocket from "./shared/connectSocket";
import { useState, useRef } from "react";
import Login from './shared/Login';
import NextQuestion from "./shared/Admin";
import { useAuth } from "./shared/AuthContext";
import React from "react";

// Define the Question data structure
export interface QuestionData {
    id: number;
    image: string;
    time: number;
    number_answers: number;
    answer: number;
}

function App() {
    const { login, user, logout, loading } = useAuth();
    const debug = false;

    // 1. Properly type the WebSocket ref
    const socketRef = useRef<WebSocket | null>(null);

    const [question, set_question] = useState<QuestionData | null>(null);
    const [phase, set_phase] = useState<number>(0);
    const [next, set_next] = useState<number>(0);

    const phases: string[] = ["Error", "Disconnected", "Connected", "Get Ready", "Answer Question", "Finished"];

    // 2. Add types to the context setter
    const set_context = (socket: WebSocket | null) => {
        socketRef.current = socket;
    };

    const handleNext = () => {
        if (!question) return;
        NextQuestion({ question_id:question.id, debug:debug });
    };

    if (!user) {
        return <Login login={login} loading={loading} debug={debug} />;
    }

    return (
        <>
            <button onClick={() => logout()}>Logout</button>

            {phase !== 4 && (
                <p className="text-center fs-1">
                    {!user.isAdmin && user.name} {phases[phase]}
                    {(user.isAdmin && phase > 2) && <>Question ({next})</>}
                </p>
            )}

            {(user.isAdmin && phase === 3) && (
                <div className="d-sm-flex align-items-center gap-3">
                    <button
                        className="btn btn-success center-self text-black mb-3 w-25"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            )}

            <ConnectSocket
                set_question={set_question}
                set_phase={set_phase}
                set_context={set_context}
                set_next={set_next}
                debug={debug}
            />

            <Question
                question={question}
                user={user}
                phase={phase}
                debug={debug}/>
        </>
    );
}

export default function Home() {
    return (
        <main>
            <App />
        </main>
    );
}