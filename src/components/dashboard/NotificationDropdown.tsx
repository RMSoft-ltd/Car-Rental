"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, AlertCircle, Info, CheckCircle, Clock } from "lucide-react";
import { LuBell } from "react-icons/lu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/app/shared/ToastProvider";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    notifications,
    isNewNotification,
    setNotifications,
    updateNotification,
    removeNotification: removeNotificationFromContext,
    resetNewNotificationFlag,
    setUnreadCount,
  } = useNotifications();
  const { success: showToast } = useToast();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const unreadCount =
    notifications && notifications.filter((n) => n.status === "unread").length;

  const { data: fetchedNotifications } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () =>
      notificationService.getNotifications({
        limit: 10,
        userId: user!.id,
      }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (fetchedNotifications?.data?.rows) {
      setNotifications(fetchedNotifications.data.rows);
      const count = fetchedNotifications.data.rows.filter(
        (n: any) => n.status === "unread"
      ).length;
      setUnreadCount(count);
    }
  }, [fetchedNotifications, setNotifications, setUnreadCount]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: (response) => {
      updateNotification(response.data);
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      notifications.forEach((n) => {
        if (n.status === "unread") {
          updateNotification({ ...n, status: "read" });
        }
      });
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/notification_sound_3.mp3");
      audioRef.current.preload = "auto";
    }
  }, []);

  // Play sound and show toast for new notifications
  useEffect(() => {
    if (isNewNotification) {
      const playSound = async () => {
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
          }
        } catch (error) {
          console.warn("Could not play notification sound:", error);
        }
      };

      const latestNotification =
        [...notifications].reverse().find((n) => n.status === "unread") || null;

      // Play sound
      playSound();

      // Show toast notification
      if (latestNotification) {
        showToast("You have a new notification 🔔", latestNotification.message);
      }

      resetNewNotificationFlag();
    }
  }, [isNewNotification, notifications, showToast, resetNewNotificationFlag]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
      >
        <LuBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* <audio ref={audioRef} src="sound/notification_sound_1.wav" /> */}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-sm text-gray-800 hover:text-gray-800 font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {markAllAsReadMutation.isPending ? "Marking..." : "Mark all read"}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${notification.status === "unread"
                      ? "bg-gray-50 border-l-4 border-l-gray-500"
                      : ""
                    }`}
                  onClick={async () => {
                    if (notification.actionUrl || notification.id) {
                      await markAsReadMutation.mutateAsync(notification.id);

                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${notification.status === "unread"
                                ? "text-gray-900"
                                : "text-gray-700"
                              }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center mt-2 space-x-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.createdAt)}
                            </span>
                            {/* {notification.actionRequired && (
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                                Action Required
                              </span>
                            )} */}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotificationFromContext(notification.id);
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Remove notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
