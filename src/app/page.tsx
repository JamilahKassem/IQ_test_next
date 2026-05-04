'use client';

import Question from "./shared/Question";
import ConnectSocket from "./shared/connectSocket";
import { useState, useRef } from "react";
import Login from './shared/Login';
import { useAuth } from "./shared/AuthContext";
import React from "react";
import {getNextQuestion} from "./shared/prisma";

// Define the Question data structure
export interface QuestionData {
    id: number;
    image: string;
    time: number;
    number_answers: number;
    answer?: number;
}

function App() {
    const { login, user, logout, loading } = useAuth();
    const debug = true;

    // 1. Properly type the WebSocket ref
    const socketRef = useRef<WebSocket | null>(null);

    const [question, set_question] = useState<QuestionData | null>(null);
    const [phase, set_phase] = useState<number>(0);
    const [next, set_next] = useState<number>(1);

    const phases: string[] = ["Error", "Disconnected", "Connected", "Get Ready", "Answer Question", "Finished"];

    // 2. Add types to the context setter
    const set_context = (socket: WebSocket | null) => {
        socketRef.current = socket;
    };

    const handleNext = async () => {
        let question_id = 0;
        if (question) {
            question_id = question.id;
        }
        if(debug) console.log("fetching question after question_id ", question_id);
        let questionResult = await getNextQuestion(question_id,debug);

        if(questionResult){
            const socket = socketRef.current;
            if (socket && socket.readyState === WebSocket.OPEN) {
                let message = {
                    type: 'NextQuestion',
                    payload: {
                        id: questionResult.id,
                        image: questionResult.image,
                        time: questionResult.time,
                        number_answers: questionResult.number_answers,
                    }
                };
                socket.send(JSON.stringify(message));
                if(debug) {
                    console.log("Sent", JSON.stringify(message));
                }
            } else {
                console.error("WebSocket is not open. Current state:", socket?.readyState);
            }
        }
    };

    if (!user) {
        return <Login login={login} loading={loading} debug={debug} />;
    }

    return (
        <>
            <ConnectSocket
                set_question={set_question}
                set_phase={set_phase}
                set_context={set_context}
                set_next={set_next}
                debug={debug}
            />

            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
                {/* Header Section */}
                {phase !== 4 && (
                    <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">IQ</div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-800">Assessment Portal</h1>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                            Logout
                        </button>
                    </div>
                )}

                <div className="max-w-4xl mx-auto">
                    {/* Question taking */}
                    {phase !== 4 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 text-center">
                            <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
                                Current Status
                            </p>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                                {!user.isAdmin && user.name} {phases[phase]}
                                {(user.isAdmin && phase > 2) && <span className="text-indigo-600"> — Question {next}</span>}
                            </h2>
                        </div>
                    )}

                    {/* Admin Controls for Getting Ready */}
                    {(user.isAdmin && phase === 3) && (
                        <div className="flex flex-col items-center justify-center bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-10 mb-6">
                            <p className="text-indigo-700 font-medium mb-4">Ready to advance the group?</p>
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                onClick={handleNext}
                            >
                                Push Next Question
                            </button>
                        </div>
                    )}

                    <Question
                        question={question}
                        user={user}
                        phase={phase}
                        debug={debug}/>
                </div>
            </div>
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