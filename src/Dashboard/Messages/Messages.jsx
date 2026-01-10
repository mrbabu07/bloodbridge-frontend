// Messages Page - Chat/Messaging System
import React, { useState, useEffect, useRef, useContext } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { AuthContext } from "../../Context/AuthProvider";
import { useSocket } from "../../Context/SocketContext";
import useAxios from "../../hooks/useAxios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Input,
  Button,
  Avatar,
  Empty,
  Spin,
  Badge,
  Typography,
  message,
} from "antd";
import {
  SendOutlined,
  SearchOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  MessageSquare,
  Send,
  Search,
  ChevronLeft,
  Circle,
  Check,
  CheckCheck,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const Messages = () => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const { refreshNotifications } = useSocket();
  const axios = useAxios();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll for new messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);

      // Poll every 5 seconds for new messages
      pollIntervalRef.current = setInterval(() => {
        fetchMessages(selectedConversation._id, true);
      }, 5000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [selectedConversation?._id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/conversations");
      setConversations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, silent = false) => {
    if (!silent) setMessagesLoading(true);
    try {
      const response = await axios.get(`/messages/${conversationId}`);
      setMessages(response.data.messages || []);

      // Refresh notification count
      refreshNotifications();

      // Update conversation unread count
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (!silent) setMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(
      (p) => p !== user?.email?.toLowerCase()
    );

    setSending(true);
    try {
      const response = await axios.post("/messages", {
        conversationId: selectedConversation._id,
        receiverEmail: otherParticipant,
        content: newMessage.trim(),
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");

      // Update conversation last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id
            ? {
                ...c,
                lastMessage: newMessage.trim().substring(0, 100),
                lastMessageAt: new Date(),
              }
            : c
        )
      );
    } catch (error) {
      message.error("Failed to send message");
      console.error("Send message error:", error);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    const otherEmail = conversation.participants.find(
      (p) => p !== user?.email?.toLowerCase()
    );
    return (
      conversation.participantUsers?.find((u) => u.email === otherEmail) || {
        email: otherEmail,
        name: otherEmail?.split("@")[0] || "User",
      }
    );
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv);
    return (
      other.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Conversation List Component
  const ConversationList = () => (
    <div
      className={`h-full flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } ${isMobileView && selectedConversation ? "hidden" : ""}`}
      style={{ borderRight: `1px solid ${theme.colors.border}` }}
    >
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{ borderColor: theme.colors.border }}
      >
        <Title level={4} style={{ color: theme.colors.text, margin: 0 }}>
          Messages
        </Title>
        <Input
          placeholder="Search conversations..."
          prefix={
            <SearchOutlined style={{ color: theme.colors.textSecondary }} />
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-3"
          style={{
            backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
            borderColor: "transparent",
          }}
        />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spin />
          </div>
        ) : filteredConversations.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text style={{ color: theme.colors.textSecondary }}>
                No conversations yet
              </Text>
            }
            className="mt-10"
          />
        ) : (
          filteredConversations.map((conversation) => {
            const other = getOtherParticipant(conversation);
            const isSelected = selectedConversation?._id === conversation._id;

            return (
              <motion.div
                key={conversation._id}
                whileHover={{
                  backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                }}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 cursor-pointer border-b transition-colors ${
                  isSelected ? (isDarkMode ? "bg-red-900/30" : "bg-red-50") : ""
                }`}
                style={{ borderColor: theme.colors.border }}
              >
                <div className="flex items-center gap-3">
                  <Badge count={conversation.unreadCount} size="small">
                    <Avatar
                      src={other.photoURL}
                      icon={<UserOutlined />}
                      size={48}
                      className="shrink-0"
                    />
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <Text
                        strong
                        style={{ color: theme.colors.text }}
                        className="truncate"
                      >
                        {other.name}
                      </Text>
                      {conversation.lastMessageAt && (
                        <Text
                          style={{
                            color: theme.colors.textSecondary,
                            fontSize: 12,
                          }}
                        >
                          {dayjs(conversation.lastMessageAt).fromNow()}
                        </Text>
                      )}
                    </div>
                    <Text
                      style={{ color: theme.colors.textSecondary }}
                      className="text-sm truncate block"
                    >
                      {conversation.lastMessage || "No messages yet"}
                    </Text>
                    {conversation.request && (
                      <Text
                        style={{ color: "#dc2626", fontSize: 11 }}
                        className="truncate block"
                      >
                        Re: {conversation.request.blood_group} blood request
                      </Text>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );

  // Chat View Component
  const ChatView = () => {
    if (!selectedConversation) {
      return (
        <div
          className={`flex-1 flex items-center justify-center ${
            isMobileView ? "hidden" : ""
          }`}
          style={{ backgroundColor: theme.colors.background }}
        >
          <div className="text-center">
            <MessageSquare
              size={64}
              className="mx-auto mb-4"
              style={{ color: theme.colors.textSecondary }}
            />
            <Text style={{ color: theme.colors.textSecondary }}>
              Select a conversation to start messaging
            </Text>
          </div>
        </div>
      );
    }

    const other = getOtherParticipant(selectedConversation);

    return (
      <div
        className={`flex-1 flex flex-col ${
          isMobileView && !selectedConversation ? "hidden" : ""
        }`}
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Chat Header */}
        <div
          className="p-4 flex items-center gap-3 border-b"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
          }}
        >
          {isMobileView && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedConversation(null)}
            />
          )}
          <Avatar src={other.photoURL} icon={<UserOutlined />} size={40} />
          <div className="flex-1">
            <Text strong style={{ color: theme.colors.text, display: "block" }}>
              {other.name}
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
              {other.bloodGroup && `Blood Group: ${other.bloodGroup}`}
            </Text>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spin />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Text style={{ color: theme.colors.textSecondary }}>
                No messages yet. Start the conversation!
              </Text>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const isOwn = msg.senderEmail === user?.email?.toLowerCase();
                return (
                  <motion.div
                    key={msg._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        isOwn
                          ? "bg-red-500 text-white rounded-br-sm"
                          : isDarkMode
                          ? "bg-gray-700 rounded-bl-sm"
                          : "bg-gray-100 rounded-bl-sm"
                      }`}
                    >
                      <Text
                        style={{
                          color: isOwn ? "white" : theme.colors.text,
                          display: "block",
                        }}
                      >
                        {msg.content}
                      </Text>
                      <div
                        className={`flex items-center gap-1 mt-1 ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <Text
                          style={{
                            color: isOwn
                              ? "rgba(255,255,255,0.7)"
                              : theme.colors.textSecondary,
                            fontSize: 10,
                          }}
                        >
                          {dayjs(msg.createdAt).format("h:mm A")}
                        </Text>
                        {isOwn &&
                          (msg.read ? (
                            <CheckCheck size={12} className="text-blue-300" />
                          ) : (
                            <Check size={12} className="text-white/70" />
                          ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div
          className="p-4 border-t"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
          }}
        >
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={sendMessage}
              className="flex-1"
              style={{
                backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                borderColor: "transparent",
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              loading={sending}
              disabled={!newMessage.trim()}
              className="bg-red-500 border-red-500"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="h-[calc(100vh-120px)] flex rounded-xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Conversation List - 1/3 width on desktop */}
      <div className={`${isMobileView ? "w-full" : "w-1/3"}`}>
        <ConversationList />
      </div>

      {/* Chat View - 2/3 width on desktop */}
      <div className={`${isMobileView ? "w-full" : "w-2/3"}`}>
        <ChatView />
      </div>
    </div>
  );
};

export default Messages;
