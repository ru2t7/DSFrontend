import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs/lib/stomp.js';

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
                    // 3. Display the alert to the user
                    alert("⚠️ OVERCONSUMPTION ALERT: " + notification.body);
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
