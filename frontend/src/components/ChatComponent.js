import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs/lib/stomp.js';

const ChatComponent = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Controls popup visibility
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (token) {
            const socket = new SockJS('http://localhost/ws-chat');
            const client = Stomp.Stomp.over(socket);
            client.debug = null;

            client.connect({ Authorization: `Bearer ${token}` }, () => {
                setStompClient(client);
                client.subscribe('/topic/messages', (msg) => {
                    setMessages(prev => [...prev, JSON.parse(msg.body)]);
                });
            });
        }
    }, [token]);

    const sendMessage = () => {
        if (stompClient && input.trim() !== "") {
            const chatMessage = {
                sender: "User",
                content: input,
                timestamp: new Date().toLocaleTimeString()
            };
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessages(prev => [...prev, chatMessage]);
            setInput("");
        }
    };

    return (
        <div style={styles.floatingContainer}>
            {/* 1. The Floating Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} style={styles.toggleButton}>
                {isOpen ? "✖ Close Chat" : "💬 Support Chat"}
            </button>

            {/* 2. The Chat Window (only visible when isOpen is true) */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>Energy Support Bot</div>
                    <div style={styles.messageArea}>
                        {messages.map((m, i) => (
                            <div key={i} style={m.sender === 'CHATBOT' ? styles.botMsg : styles.userMsg}>
                                <small style={{ display: 'block', fontSize: '10px' }}>{m.sender}</small>
                                {m.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={styles.inputArea}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type 'help'..."
                            style={styles.input}
                        />
                        <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// 🎨 Styles for the floating popup
const styles = {
    floatingContainer: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif'
    },
    toggleButton: {
        padding: '12px 20px',
        borderRadius: '50px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontWeight: 'bold'
    },
    chatWindow: {
        width: '320px',
        height: '400px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
        overflow: 'hidden',
        border: '1px solid #eee'
    },
    header: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    messageArea: {
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    botMsg: {
        alignSelf: 'flex-start',
        backgroundColor: '#e9ecef',
        padding: '8px 12px',
        borderRadius: '12px 12px 12px 0',
        maxWidth: '80%',
        fontSize: '14px'
    },
    userMsg: {
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '12px 12px 0 12px',
        maxWidth: '80%',
        fontSize: '14px'
    },
    inputArea: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #eee'
    },
    input: {
        flex: 1,
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        outline: 'none'
    },
    sendBtn: {
        marginLeft: '5px',
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default ChatComponent;
