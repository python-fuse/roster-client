import React, { createContext, useContext, useReducer, useEffect } from "react";
import { APIService } from "@/services/api";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import type { Notification } from "@/types/definitions";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

type NotificationAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string } // notification id
  | { type: "MARK_ALL_AS_READ" }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_NOTIFICATIONS" };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_NOTIFICATIONS": {
      const notifications = action.payload;
      const unreadCount = notifications.filter((n) => !n.read).length;
      return {
        ...state,
        notifications,
        unreadCount,
        isLoading: false,
        error: null,
      };
    }

    case "ADD_NOTIFICATION": {
      const newNotifications = [action.payload, ...state.notifications];
      const unreadCount = newNotifications.filter((n) => !n.read).length;
      return {
        ...state,
        notifications: newNotifications,
        unreadCount,
      };
    }

    case "MARK_AS_READ": {
      const notifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return {
        ...state,
        notifications,
        unreadCount,
      };
    }

    case "MARK_ALL_AS_READ": {
      const notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      return {
        ...state,
        notifications,
        unreadCount: 0,
      };
    }

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "CLEAR_NOTIFICATIONS":
      return { ...initialState };

    default:
      return state;
  }
};

interface NotificationContextType {
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { state: authState } = useAuth();
  const { socket } = useSocket();

  const fetchNotifications = async () => {
    if (!authState.user) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await APIService.getUserNotifications(authState.user.id);

      // Handle both direct array and nested {notifications} response
      const notifications =
        (response.data as any).notifications || response.data;
      dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to load notifications",
      });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      //   await APIService.markNotificationAsRead(id);
      //   dispatch({ type: "MARK_AS_READ", payload: id });

      // Emit socket event for real-time sync across sessions
      if (socket?.connected) {
        socket.emit("markAsRead", id);
      }
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to update notification",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await APIService.markAllNotificationsAsRead();
      dispatch({ type: "MARK_ALL_AS_READ" });

      // Emit socket event for real-time sync across sessions
      if (socket?.connected) {
        socket.emit("markAllAsRead");
      }
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to update notifications",
      });
    }
  };

  // Fetch notifications when user logs in
  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      fetchNotifications();
    } else if (!authState.user) {
      dispatch({ type: "CLEAR_NOTIFICATIONS" });
    }
  }, [authState.user, authState.isLoading]);

  // Refresh notifications every 30 seconds when user is active
  useEffect(() => {
    if (!authState.user) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [authState.user]);

  // Socket event listeners for real-time notifications
  useEffect(() => {
    if (!socket?.connected || !authState.user) return;

    console.log("🔔 Setting up notification socket listeners");

    // Listen for new notifications
    const handleNewNotification = (notification: Notification) => {
      console.log("🔔 New notification received:", notification);
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    };

    // Listen for notification marked as read (from other sessions)
    const handleNotificationRead = (data: { notificationId: string }) => {
      console.log("✅ Notification marked as read:", data.notificationId);
      dispatch({ type: "MARK_AS_READ", payload: data.notificationId });
    };

    // Listen for all notifications marked as read (from other sessions)
    const handleAllNotificationsRead = () => {
      console.log("✅ All notifications marked as read");
      dispatch({ type: "MARK_ALL_AS_READ" });
    };

    // Register socket event listeners
    socket.on("notification", handleNewNotification);
    socket.on("notificationRead", handleNotificationRead);
    socket.on("allNotificationsRead", handleAllNotificationsRead);

    // Cleanup listeners on unmount or when socket/auth changes
    return () => {
      console.log("🧹 Cleaning up notification socket listeners");
      socket.off("notification", handleNewNotification);
      socket.off("readNotification", handleNotificationRead);
      socket.off("allNotificationsRead", handleAllNotificationsRead);
    };
  }, [socket?.connected, authState.user]);

  const value = {
    state,
    dispatch,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
