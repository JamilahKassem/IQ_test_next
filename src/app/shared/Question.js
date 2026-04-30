'use client'
import {useEffect, useState} from 'react';

function Qeustion({ qid, user, debug, phase }) {
    const [question, setQuestion] = useState([]);
    const [Answer, setAnswer] = useState(null);
    const [Sent, setSent] = useState(false);
    const [saved, setSaved] = useState(true);
    useEffect(() => {
        if (qid === -1) {
            setQuestion([]);
        }else{
            const fetchData = async () => {
                try {
                    // const data = await request(`questions/${user.uid}`,debug);
                    // setQuestion(data);
                    // setAnswer(data.Answer)
                    // setSaved(false);
                    // if (debug){
                    //     console.log("creating a question with",data);
                    // }
                } catch (err) {}
            };
            fetchData().then(() => {if (debug)console.log("fetsh done")});
        }
    }, [qid]);

    useEffect(() => {
        let loginTimeout;
        if (Sent) {
            loginTimeout = setTimeout(() => {setSent(false)}, 2000);
        }
        return () => clearTimeout(loginTimeout);
    }, [Sent]);

    useEffect(() => {
        if(phase === 3 && !saved) {
            console.log("Sending answer after time done");
            SendAnswer();
        }
    }, [phase]);

    function SendAnswer(){
        if(Answer === null)return;
        const SendData = async () => {
            try {
                // const questionData = {uid: user.uid, answer: Answer};
                // if(debug)console.log("Sending answer", questionData)
                // let data = await request(`Answer`,debug,false,questionData);
                // setSent(true);
                // setSaved(true);
                // if (data.success){
                //     console.log("Answer sent");
                // }else{
                //     console.log("Answer failed");
                // }
            } catch (err) {}
        };
        SendData().then(() => {if (debug)console.log("fetsh done")});
    }
    const handleChange = (e) => {
        setAnswer(parseInt(e.target.value));
    }

    if (question.length === 0) return <></>;
    let letter = "A";
    if(phase === 4){
        return (
            <div className="align-items-center center-self">
                <img className="center-self question" src={require(`../images/${question.Question}`).default.src} key={question.ID}/>
                {user.admin === false && (
                    <>
                        <div className="answer-container w-75">
                            {Array.from({ length: question.NAns }, (_, i) => (
                                <label key={i}>{String.fromCharCode(letter.charCodeAt(0)+i)}) {" "}
                                    <input type="radio" name="Answer" value={i} checked={Answer === i} onChange={handleChange}/>
                                </label>
                            ))}
                        </div>
                        <div>
                            {Sent && (<p>Answer Saved.</p>)}
                            <button className="btn center-self btn-success text-black mb-3 w-75" disabled={Answer === null} onClick={SendAnswer}>Submit</button>
                        </div>
                    </>)
                }
            </div>
        );
    }
    if(phase === 3){
        return (
            <h2 className="mx-auto text-center fs-lg-6 fs-md-5 w-lg-75">
                {user.admin ? (<h2>Press next to proceed</h2>) : (<h2>Get Ready for next question</h2>)}
            </h2>
        );
    }
}

export default Qeustion
