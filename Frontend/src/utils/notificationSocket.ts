import * as SockJS from 'sockjs-client'; 
import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectToNotificationSocket = (
  userId: string,
  onNotification: (notification: any) => void
) => {
  const socket = new SockJS.default('http://localhost:8080/ws'); // ✅ Use .default here
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('📡 Connected to WebSocket');
      stompClient?.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        if (message.body) {
          const notification = JSON.parse(message.body);
          onNotification(notification);
        }
      });
    },
    onStompError: (frame) => {
      console.error('❌ STOMP error:', frame);
    },
  });
  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log('🔌 Disconnected from WebSocket');
  }
};
