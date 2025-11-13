"use client";

import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Notification } from "@/types/notification";
import { TokenService } from "@/utils/token";

interface SocketProviderProps {
  children: React.ReactNode;
  apiUrl: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  apiUrl,
}) => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const accessToken = TokenService.getToken();

    if (isAuthenticated && accessToken && apiUrl) {
      // Connect socket
      if (socketRef.current?.connected) return;

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      socketRef.current = io(apiUrl, {
        auth: { token: accessToken },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current.on("connect_error", (error: Error) => {
        console.error("Socket connection error:", error.message);
      });

      socketRef.current.on("error", (error: Error) => {
        console.error("Socket error:", error.message);
      });

      socketRef.current.on(
        "new-notification",
        (data: { data: Notification; type: string; timestamp: string }) => {
          addNotification(data.data);
        }
      );
    } else {
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, apiUrl, addNotification]);

  return <>{children}</>;
};
