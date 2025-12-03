import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000",{
    transports: ["websocket"],
});

const ChatApp = () => {
    const [messages, setMessages] = React.useState([]);
    const [newMsg, setNewMsg] = React.useState("");
    const [notifications, setNotifications] = React.useState("");

    const messageEndRef = React.useRef(null);
    
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        socket.on("connect", () => {
            setNotifications("Connected to chat server");
        });

        socket.on("disconnect", () => {
            setNotifications("Disconnected from chat server");
        });
        
        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });
        socket.on("user-joined", (user) => {
            setNotifications(`${user} joined the chat`);
        });
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
            socket.off("user-joined");
        };
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if(!newMsg.trim()) return;
        const messageData = {
            user:"User1",
            text: newMsg,
            timestamp: new Date().toLocaleTimeString()
        };
        socket.emit("message", messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMsg("");
    }
    const mockIncoming = () => {
        const mockMessage = {
            user: "User2",
            text: "Hello from User2!",
            timestamp: new Date().toLocaleTimeString()
        };
        socket.emit("message", mockMessage);
    };
    return (
        <div>
            <h2>Chat Application</h2>
            <div>
                <strong>Notifications:</strong> {notifications}
            </div>
            <div style={{border: "1px solid black", height: "300px", overflowY: "scroll", marginBottom: "10px"}}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}</strong> [{msg.timestamp}]: {msg.text}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <input 
                type="text" 
                value={newMsg} 
                onChange={(e) => setNewMsg(e.target.value)} 
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            <button onClick={mockIncoming} style={{marginLeft: "10px"}}>Mock Incoming Message</button>
        </div>
    );
};

export default ChatApp;
