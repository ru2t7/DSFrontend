import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs/lib/stomp.js';
import { toast } from 'react-toastify';
const WebSocketNotification = ({token}) => {
    useEffect(() => {

        let stompClient = null; // Declare it here so the cleanup function can see it

        if (token&& token !== "null") { // Don't connect if not logged in
        // 1. Connect to the Traefik URL (which routes to your Communication Microservice)
            console.log("Token received! Opening WebSocket...");
            const socket = new SockJS(`http://localhost/ws-chat`);
            stompClient = Stomp.Stomp.over(socket);
            stompClient.debug = () => {};
            stompClient.connect({ Authorization: `Bearer ${token}` }, (frame) => {
                console.log('✅ Connected to WebSocket: ' + frame);

                // 2. Subscribe to the exact topic used in your Java NotificationConsumer
                stompClient.subscribe('/topic/notifications', (notification) => {

                    if (notification.body) {
                        let displayMessage = "";
                        try{
                        const alertData = JSON.parse(notification.body);
                            displayMessage = alertData.content || alertData.message || JSON.stringify(alertData);
                        }catch(e){
                            // If it's NOT JSON (just a string), use the body directly
                            displayMessage = notification.body;
                        }
                    // alert("⚠️ OVERCONSUMPTION ALERT: " + notification.body);
                        // 🚀 REPLACE alert() WITH toast.error()
                        toast.error(displayMessage, {
                            position: "top-right",
                            autoClose: 10000,
                            theme: "colored",
                        });
                }
            });
        }, (error) => {
                console.error('❌ WebSocket error:', error);
        });
        }else {
            console.log("No token found, skipping WebSocket connection.");
        }

        // Cleanup on unmount
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
            }
        };
    }, [token]);

    return null; // This component doesn't need to render anything
};

export default WebSocketNotification;
