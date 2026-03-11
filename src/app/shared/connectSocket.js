'use client'
import { useEffect,useRef } from "react";
import config from "@/app/config/config";
function ConnectSocket({ set_phase, set_qid, set_next, set_context, debug }) {
    const socket = useRef(null);
    let port = config.portSocket;
    let reconnectTimeout;
    useEffect(() => {
        const connect = () => {
            socket.current = new WebSocket(window.location.toString().replace("3000", port));
            set_context(socket.current);
            const onError = () => {
                if(debug){
                    console.log("Socket Error");
                }
                set_phase(0);
            };
            const onClose = () => {
                if(debug){
                    console.log("Socket Closed");
                }
                reconnectTimeout = setTimeout(() => {connect();}, 2000);
                set_phase(1);
            };
            const onOpen = () => {
                if(debug){
                    console.log("Socket Connected");
                }
                clearTimeout(reconnectTimeout);
                set_phase(2);
            };
            const handleMessage = (event) => {
                const data = JSON.parse(event.data); //3 get ready 4 get question 5 finished
                if(debug){console.log("received message with",data);}
                if (data.type === 'Pause') {set_phase(3);set_next(data.a);}
                if (data.type === 'Next') {if(data.a!==-1){set_phase(4);set_qid(data.a);}}
                if (data.type === 'End') {set_phase(5);}
            };
            socket.current.addEventListener('open', onOpen);
            socket.current.addEventListener('close', onClose);
            socket.current.addEventListener('error', onError);
            socket.current.addEventListener('message', handleMessage);
            return () => {
                socket.current.removeEventListener('open', onOpen);
                socket.current.removeEventListener('close', onClose);
                socket.current.removeEventListener('error', onError);
                socket.current.removeEventListener('message', handleMessage);
                socket.current.close();
                clearTimeout(reconnectTimeout);
            };
        };
        connect(); // Initial call
    }, []);
}
export default ConnectSocket
