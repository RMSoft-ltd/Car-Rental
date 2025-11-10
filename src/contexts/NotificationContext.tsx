"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "@/types/notification";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isNewNotification: boolean;
    addNotification: (notification: Notification) => void;
    removeNotification: (id: number) => void;
    updateNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
    setUnreadCount: (count: number) => void;
    resetNewNotificationFlag: () => void;
    clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNewNotification, setIsNewNotification] = useState(false);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        if (!notification.status || notification.status === "unread") {
            setUnreadCount((prev) => prev + 1);
        }
        setIsNewNotification(true);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => {
            const notification = prev.find((n) => n.id === id);
            if (notification?.status === "unread") {
                setUnreadCount((count) => Math.max(0, count - 1));
            }
            return prev.filter((n) => n.id !== id);
        });
    };

    const updateNotification = (notification: Notification) => {
        setNotifications((prev) => {
            const index = prev.findIndex((n) => n.id === notification.id);
            if (index !== -1) {
                const oldNotification = prev[index];
                const wasUnread = oldNotification.status === "unread";
                const isNowRead = notification.status === "read";

                if (wasUnread && isNowRead) {
                    setUnreadCount((count) => Math.max(0, count - 1));
                } else if (!wasUnread && !isNowRead) {
                    setUnreadCount((count) => count + 1);
                }

                const newNotifications = [...prev];
                newNotifications[index] = notification;
                return newNotifications;
            }
            return prev;
        });
    };

    const resetNewNotificationFlag = () => {
        setIsNewNotification(false);
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isNewNotification,
                addNotification,
                removeNotification,
                updateNotification,
                setNotifications,
                setUnreadCount,
                resetNewNotificationFlag,
                clearAllNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
