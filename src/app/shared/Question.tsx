'use client';
import { useEffect, useState, type ChangeEvent } from 'react';
import {addResult, getAnswer} from "./prisma";
import type {QuestionData} from "../page";

// Define the User interface (matching your AuthContext)
interface User {
    id: number;
    name: string;
    school?: string;
    isAdmin: boolean;
}
interface AnswerData {
    answer: number;
}

interface QuestionProps {
    question: QuestionData | null;
    user: User;
    debug: boolean;
    phase: number;
}

function Question({ question, user, phase, debug }: QuestionProps) {
    const [answer, setAnswer] = useState<number>(-1);
    const [sent, setSent] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(true);

    useEffect(() => {
        if(user.isAdmin) return;
        const fetchAnswer = async () => {
            if (!question) return null;
            try {
                const data: AnswerData | null = await getAnswer(question.id, user.id, debug);
                if(data){
                    if(debug) console.log("Got answer", data);
                    setAnswer(data.answer);
                    setSaved(false);
                }
            } catch (err) {
                if (debug) console.error("Fetch error:", err);
            }
        };
        fetchAnswer().then(() => {
            if (debug) console.log("Fetch done");
        });
    }, [question]);

    // wait two seconds before clearing the sent state
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (sent) {
            timer = setTimeout(() => { setSent(false); }, 2000);
        }
        return () => clearTimeout(timer);
    }, [sent]);

    // Automatically send an answer when a phase changes from 4 (Active) to 3 (Get Ready/Paused)
    useEffect(() => {
        if (phase === 3 && !saved) {
            if(debug){
                console.log("Sending answer after time done");
            }
            sendAnswer().then(r => console.log("Answer sent:", r));
        }
    }, [phase, saved]);

    const sendAnswer = async () => {
        if (answer === -1 || !question) return;
        try {
            await addResult(question.id, user.id, answer, debug);
            setSent(true);
            setSaved(true);
        } catch (err) {
            if (debug) console.error("Send error:", err);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAnswer(parseInt(e.target.value));
        setSaved(false);
    };

    if (!question) return null;

    const startLetter = "A";

    if (phase === 4) {
        return (
            <div className="h-screen overflow-hidden flex flex-col p-4 bg-slate-50">
                {/* Question Image Container - Expands to fill top space */}
                <div className="flex-1 min-h-0 bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center">
                    <img
                        alt="Question Task"
                        src={`/images/${question.image}`}
                        key={question.id}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>

                {!user.isAdmin && (
                    <div className="flex flex-col gap-4 pt-4 shrink-0">
                        {/* Answer Selection Grid - Fixed height based on content */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Array.from({ length: question.number_answers }, (_, i) => (
                                <label
                                    key={i}
                                    className={`
                            relative flex flex-col items-center justify-center py-4 md:py-6 rounded-2xl border-2 cursor-pointer transition-all
                            ${answer === i
                                        ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}
                        `}
                                >
                                    <input
                                        type="radio"
                                        name="Answer"
                                        className="sr-only"
                                        value={i}
                                        checked={answer === i}
                                        onChange={handleChange}
                                    />
                                    <span className={`text-xl md:text-2xl font-black ${answer === i ? "text-indigo-700" : "text-slate-400"}`}>
                            {String.fromCharCode(startLetter.charCodeAt(0) + i)}
                        </span>
                                </label>
                            ))}
                        </div>

                        {/* Submission Area - Bottom Bar */}
                        <div className="flex flex-col items-center pb-2">
                            {sent && (
                                <p className="text-green-600 font-bold mb-2 text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                    Answer Recorded
                                </p>
                            )}
                            <button
                                disabled={answer === null}
                                onClick={sendAnswer}
                                className={`
                        w-full md:w-80 py-4 rounded-2xl font-extrabold text-lg transition-all
                        ${answer === null
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 text-white hover:bg-black shadow-xl active:scale-95"}
                    `}
                            >
                                Submit Answer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (phase === 3) {
        return (
            <div className="text-center py-20">
                <h2 className="text-4xl font-black text-slate-800 animate-pulse">
                    {user.isAdmin ? "Awaiting your command..." : "Take a breath. Get ready."}
                </h2>
                <p className="text-slate-500 mt-4 font-medium">The next challenge is loading.</p>
            </div>
        );
    }

    return null;
}

export default Question;