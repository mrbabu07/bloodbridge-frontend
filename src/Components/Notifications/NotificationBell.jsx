import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Dropdown,
  Empty,
  Button,
  Typography,
  Space,
  Tooltip,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  HeartFilled,
  UserOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  MessageOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useSocket } from "../../Context/SocketContext";
import { useTheme } from "../../Context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const NotificationBell = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    messageUnreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    deleteNotification,
    isConnected,
    refreshNotifications,
  } = useSocket();
  const { isDarkMode, theme } = useTheme();
  const [open, setOpen] = useState(false);

  const totalUnread = unreadCount + messageUnreadCount;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "urgent_request":
        return <WarningOutlined className="text-red-500" />;
      case "donation_confirmed":
        return <HeartFilled className="text-green-500" />;
      case "donation_completed":
        return <GiftOutlined className="text-purple-500" />;
      case "new_message":
        return <MessageOutlined className="text-blue-500" />;
      case "welcome":
        return <UserOutlined className="text-blue-500" />;
      case "request_matched":
        return <HeartFilled className="text-pink-500" />;
      default:
        return <InfoCircleOutlined className="text-gray-500" />;
    }
  };

  const getNotificationBg = (notification) => {
    if (!notification.read) {
      return isDarkMode ? "bg-blue-900/30" : "bg-blue-50";
    }
    return isDarkMode ? "bg-gray-800" : "bg-white";
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Navigate based on notification type
    if (
      notification.type === "new_message" &&
      notification.data?.conversationId
    ) {
      navigate("/dashboard/messages");
    } else if (
      notification.type === "urgent_request" &&
      notification.data?.requestId
    ) {
      navigate(`/donation-request/${notification.data.requestId}`);
    } else if (
      notification.type === "donation_confirmed" ||
      notification.type === "donation_completed"
    ) {
      navigate("/dashboard/my-request");
    }

    setOpen(false);
  };

  const notificationContent = (
    <div
      className={`w-80 max-h-[480px] overflow-hidden rounded-xl shadow-2xl ${
        isDarkMode
          ? "bg-gray-900 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 p-4 border-b flex justify-between items-center ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <Title level={5} style={{ margin: 0, color: theme.colors.text }}>
            Notifications
          </Title>
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              style={{ backgroundColor: "#dc2626" }}
              size="small"
            />
          )}
        </div>
        <Space size="small">
          <Tooltip title="Refresh">
            <Button
              type="text"
              size="small"
              icon={
                <motion.span
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  🔄
                </motion.span>
              }
              onClick={(e) => {
                e.stopPropagation();
                refreshNotifications();
              }}
            />
          </Tooltip>
          {unreadCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              Read all
            </Button>
          )}
        </Space>
      </div>

      {/* Message Unread Banner */}
      {messageUnreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 cursor-pointer ${
            isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
          }`}
          onClick={() => {
            navigate("/dashboard/messages");
            setOpen(false);
          }}
        >
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-blue-500" />
            <Text style={{ color: theme.colors.text }}>
              You have <strong>{messageUnreadCount}</strong> unread message
              {messageUnreadCount > 1 ? "s" : ""}
            </Text>
          </div>
        </motion.div>
      )}

      {/* Notification List */}
      <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
        {notifications.length === 0 ? (
          <div className="p-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <Text style={{ color: theme.colors.textSecondary }}>
                    No notifications yet
                  </Text>
                  <br />
                  <Text
                    style={{ color: theme.colors.textSecondary, fontSize: 12 }}
                  >
                    We'll notify you when something important happens
                  </Text>
                </div>
              }
            />
          </div>
        ) : (
          <AnimatePresence>
            {notifications.slice(0, 15).map((notification, idx) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-3 cursor-pointer hover:opacity-90 transition-all border-b ${getNotificationBg(
                  notification
                )}`}
                style={{ borderColor: theme.colors.border }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <motion.div
                    className="shrink-0 mt-1"
                    whileHover={{ scale: 1.2 }}
                  >
                    {getNotificationIcon(notification.type)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <Text
                      strong={!notification.read}
                      style={{ color: theme.colors.text, display: "block" }}
                      className="text-sm"
                    >
                      {notification.title ||
                        notification.type?.replace(/_/g, " ")}
                    </Text>
                    <Text
                      style={{ color: theme.colors.textSecondary }}
                      className="text-xs line-clamp-2"
                    >
                      {notification.message}
                    </Text>
                    <Text
                      style={{ color: theme.colors.textSecondary }}
                      className="text-xs mt-1 block"
                    >
                      {dayjs(notification.createdAt).fromNow()}
                    </Text>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {!notification.read && (
                      <motion.div
                        className="w-2 h-2 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-500"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          className={`sticky bottom-0 p-3 border-t flex justify-between items-center ${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <Button
            type="link"
            size="small"
            onClick={() => {
              navigate("/dashboard/notifications");
              setOpen(false);
            }}
            style={{ color: "#dc2626" }}
          >
            View All
          </Button>
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              clearNotifications();
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      popupRender={() => notificationContent}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <motion.div
        className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Badge count={totalUnread} size="small" offset={[-2, 2]}>
          <motion.div
            animate={totalUnread > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{
              duration: 0.5,
              repeat: totalUnread > 0 ? Infinity : 0,
              repeatDelay: 3,
            }}
          >
            <BellOutlined
              style={{
                fontSize: "20px",
                color: isDarkMode ? "#e4e4e7" : "#374151",
              }}
            />
          </motion.div>
        </Badge>
        {!isConnected && (
          <div
            className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"
            title="Offline - notifications may be delayed"
          />
        )}
      </motion.div>
    </Dropdown>
  );
};

export default NotificationBell;
