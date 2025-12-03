import React, {useEffect, useState, useRef} from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000",{
    transports: ["websocket"],
});

const WebSocketDemo = () => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("Connecting....");
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
      
    useEffect(() => {
        socket.on("connect", () => {
            setStatus("Connected");
        });

        socket.on("disconnect", () => {
            setStatus("Disconnected");
        });

        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
        };
    }, [messages]);

    return (
        <div>
            <h2>WebSocket Demo</h2>
            <div>
                <strong>Status:</strong> {status}
            </div>
            <div>
                <strong>Messages:</strong>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
            </div>
        </div>
    );
};

export default WebSocketDemo;
