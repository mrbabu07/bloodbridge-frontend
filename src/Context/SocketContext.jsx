import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { AuthContext } from "./AuthProvider";
import useAxios from "../hooks/useAxios";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Polling interval in milliseconds (10 seconds)
const POLL_INTERVAL = 10000;

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const axios = useAxios();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const pollIntervalRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.get("/notifications?limit=20");
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
      setIsConnected(true);
    } catch (error) {
      // Silently handle 401 errors (user not authenticated)
      if (error.response?.status === 401) {
        setIsConnected(false);
        return;
      }
      console.error("Failed to fetch notifications:", error);
      setIsConnected(false);
    }
  }, [user, axios]);

  // Fetch unread message count
  const fetchMessageUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.get("/messages/unread/count");
      setMessageUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      // Silently handle 401 errors (user not authenticated)
      if (error.response?.status === 401) {
        return;
      }
      console.error("Failed to fetch message count:", error);
    }
  }, [user, axios]);

  // Start polling when user is logged in
  useEffect(() => {
    if (user) {
      // Initial fetch
      fetchNotifications();
      fetchMessageUnreadCount();

      // Set up polling
      pollIntervalRef.current = setInterval(() => {
        fetchNotifications();
        fetchMessageUnreadCount();
      }, POLL_INTERVAL);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    } else {
      // Clear notifications when logged out
      setNotifications([]);
      setUnreadCount(0);
      setMessageUnreadCount(0);
      setIsConnected(false);
    }
  }, [user, fetchNotifications, fetchMessageUnreadCount]);

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await axios.patch(`/notifications/${notificationId}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [axios]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, [axios]);

  // Clear all notifications
  const clearNotifications = useCallback(async () => {
    try {
      await axios.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  }, [axios]);

  // Delete single notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await axios.delete(`/notifications/${notificationId}`);
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId)
        );
        // Recalculate unread count
        setUnreadCount((prev) => {
          const notification = notifications.find(
            (n) => n._id === notificationId
          );
          return notification && !notification.read
            ? Math.max(0, prev - 1)
            : prev;
        });
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [axios, notifications]
  );

  // Refresh notifications manually
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
    fetchMessageUnreadCount();
  }, [fetchNotifications, fetchMessageUnreadCount]);

  return (
    <SocketContext.Provider
      value={{
        socket: null,
        isConnected,
        notifications,
        unreadCount,
        messageUnreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        deleteNotification,
        refreshNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
