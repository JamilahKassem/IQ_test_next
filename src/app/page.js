'use client'
import Qeustion from "./shared/Question";
import ConnectSocket from "./shared/connectSocket";
import {useState,useRef } from "react";
import Login from './shared/Login.tsx';
import NextQeustion from "./shared/Admin.ts";
import {useAuth} from "./shared/AuthContext.tsx";

function App()
{
    const { login, user, logout, loading } = useAuth();
    const debug = false;
    const socketRef = useRef(null);
    const [qid, set_qid] = useState(-1);
    const [phase, set_phase] = useState(0);
    const [next, set_next] = useState(0);
    let phases = ["Error","Disconnected","Connected","Get Ready","Answer Question","Finished"]
    function set_context(socket){socketRef.current = socket;}
    function handleNext(){NextQeustion({ debug })}
  if (!user)
  {
      return (
      <>
        <Login login={login} loading={loading} debug={debug} />
      </>);
  }
  return (
      <>
          <button onClick={logout()}>Logout</button>
          {phase !==4 && <p className="text-center fs-1">{!user.admin && user.name} {phases[phase]} {(user.admin && phase > 2) && <>Question ({next})</>}</p>}
          {(user.admin && phase === 3) && <div className="d-sm-flex align-items-center gap-3"><button className="btn btn-success center-self text-black mb-3 w-25" onClick={handleNext}>Next</button></div>}
          <ConnectSocket set_qid={set_qid} set_phase={set_phase} set_context={set_context} set_next={set_next} debug={debug}/>
          <Qeustion qid={qid} phase={phase} user={user} debug={debug}/>
      </>
  );
}
export default function Home() {return (<main><App /></main>);}
