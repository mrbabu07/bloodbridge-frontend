import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Modal,
  Empty,
  Input,
  Select,
} from "antd";
import { useTheme } from "../../Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  MessageSquare,
  Mail,
  Calendar,
  Eye,
  Search,
  Clock,
  CheckCircle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

const ContactMessages = () => {
  const { isDarkMode, theme } = useTheme();
  const axiosSecure = useAxiosSecure();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, [pagination.current]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/contacts?page=${pagination.current}&limit=${pagination.pageSize}`
      );
      setMessages(res.data.contacts || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination?.total || 0,
      }));
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "12px",
  };

  const columns = [
    {
      title: "Sender",
      key: "sender",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-500">
            {record.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <Text strong style={{ color: theme.colors.text }}>
              {record.name}
            </Text>
            <div className="flex items-center gap-1">
              <Mail size={12} style={{ color: theme.colors.textSecondary }} />
              <Text
                style={{ color: theme.colors.textSecondary }}
                className="text-xs"
              >
                {record.email}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Text style={{ color: theme.colors.text }}>{subject}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "unread"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {status === "unread" ? "Unread" : "Read"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
          {dayjs(date).fromNow()}
        </Text>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<Eye size={14} />}
          onClick={() => {
            setSelectedMessage(record);
            setModalVisible(true);
          }}
          className="bg-blue-500 border-blue-500"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      {/* Header */}
      <div className="mb-6">
        <Title level={3} style={{ color: theme.colors.text, margin: 0 }}>
          Contact Messages
        </Title>
        <Text style={{ color: theme.colors.textSecondary }}>
          Manage inquiries from website visitors
        </Text>
      </div>

      {/* Search */}
      <Card style={cardStyle} className="border-0 shadow-sm mb-6">
        <Input
          placeholder="Search by name, email, or subject..."
          prefix={
            <Search size={16} style={{ color: theme.colors.textSecondary }} />
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
        />
      </Card>

      {/* Messages Table */}
      <Card style={cardStyle} className="border-0 shadow-sm">
        {filteredMessages.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredMessages}
            rowKey="_id"
            loading={loading}
            pagination={{
              ...pagination,
              onChange: (page) =>
                setPagination((prev) => ({ ...prev, current: page })),
            }}
          />
        ) : (
          <Empty description="No contact messages yet" />
        )}
      </Card>

      {/* Message Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            <span>Message Details</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="reply"
            type="primary"
            onClick={() => window.open(`mailto:${selectedMessage?.email}`)}
            className="bg-blue-500 border-blue-500"
          >
            Reply via Email
          </Button>,
        ]}
        width={500}
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-blue-500">
                {selectedMessage.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <Text strong style={{ color: theme.colors.text }}>
                  {selectedMessage.name}
                </Text>
                <Text
                  style={{ color: theme.colors.textSecondary }}
                  className="block text-sm"
                >
                  {selectedMessage.email}
                </Text>
              </div>
            </div>
            <div>
              <Text
                style={{ color: theme.colors.textSecondary }}
                className="text-xs uppercase"
              >
                Subject
              </Text>
              <Title
                level={5}
                style={{ color: theme.colors.text, marginTop: 4 }}
              >
                {selectedMessage.subject}
              </Title>
            </div>
            <div>
              <Text
                style={{ color: theme.colors.textSecondary }}
                className="text-xs uppercase"
              >
                Message
              </Text>
              <Paragraph style={{ color: theme.colors.text, marginTop: 4 }}>
                {selectedMessage.message}
              </Paragraph>
            </div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              <Calendar size={14} />
              <span>
                {dayjs(selectedMessage.createdAt).format(
                  "MMMM D, YYYY [at] h:mm A"
                )}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactMessages;
