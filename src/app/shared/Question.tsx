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
            <div className="align-items-center center-self">
                {/* Note: In Next.js/TS, ensure the path to images is handled correctly via public folder or imports */}
                <img
                    alt="Question Task"
                    className="center-self question"
                    src={`/images/${question.image}`}
                    key={question.id}
                />
                {!user.isAdmin && (
                    <>
                        <div className="answer-container w-75">
                            {Array.from({ length: question.number_answers }, (_, i) => (
                                <label key={i}>
                                    {String.fromCharCode(startLetter.charCodeAt(0) + i)}){" "}
                                    <input
                                        type="radio"
                                        name="Answer"
                                        value={i}
                                        checked={answer === i}
                                        onChange={handleChange}
                                    />
                                </label>
                            ))}
                        </div>
                        <div>
                            {sent && <p>Answer Saved.</p>}
                            <button
                                className="btn center-self btn-success text-black mb-3 w-75"
                                disabled={answer === null}
                                onClick={sendAnswer}
                            >
                                Submit
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    if (phase === 3) {
        return (
            <h2 className="mx-auto text-center fs-lg-6 fs-md-5 w-lg-75">
                {user.isAdmin ? "Press next to proceed" : "Get Ready for next question"}
            </h2>
        );
    }

    return null;
}

export default Question;