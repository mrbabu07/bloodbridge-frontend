import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Empty,
  Typography,
  Table,
  Space,
} from "antd";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import Loading from "../Pages/Loading";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  AnimatedCounter,
} from "../Components/Animations";

const { Title, Text } = Typography;
const { confirm } = Modal;

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosSecure.get("/my-request?size=10&page=0");
      const allRequests = res.data.request || [];
      setRequests(allRequests);
      setStats({
        total: res.data.totalRequest || allRequests.length,
        pending: allRequests.filter((r) => r.donation_status === "pending")
          .length,
        inProgress: allRequests.filter(
          (r) => r.donation_status === "inprogress"
        ).length,
        completed: allRequests.filter((r) => r.donation_status === "done")
          .length,
      });
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load requests");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-request/${id}/update-status`, {
        donation_status: newStatus,
      });
      fetchData();
      toast.success(`Request marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Delete this request?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await axiosSecure.delete(`/requests/${id}`);
          setRequests((prev) => prev.filter((r) => r._id !== id));
          toast.success("Request deleted");
        } catch (err) {
          toast.error("Failed to delete");
        }
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      done: "#22c55e",
      pending: "#eab308",
      inprogress: "#3b82f6",
      canceled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "12px",
  };

  if (loading) return <Loading />;

  const columns = [
    {
      title: "Recipient",
      key: "recipient",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: theme.colors.text }}>
            {record.recipientName}
          </Text>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={12} style={{ color: theme.colors.textSecondary }} />
            <Text
              style={{ color: theme.colors.textSecondary }}
              className="text-xs"
            >
              {record.district}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Blood",
      dataIndex: "blood_group",
      key: "blood_group",
      render: (bg) => (
        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg text-sm font-medium">
          {bg}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "donation_date",
      key: "date",
      render: (date) => (
        <Text style={{ color: theme.colors.textSecondary }}>
          {date || "Not set"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "donation_status",
      key: "status",
      render: (status) => (
        <span
          className="px-2 py-1 rounded-full text-xs font-medium capitalize"
          style={{
            backgroundColor: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<Eye size={14} />}
            onClick={() => navigate(`/donation-request/${record._id}`)}
          />
          <Button
            size="small"
            icon={<Edit size={14} />}
            onClick={() => navigate(`/dashboard/edit-request/${record._id}`)}
          />
          <Button
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={() => showDeleteConfirm(record._id)}
          />
          {record.donation_status === "inprogress" && (
            <>
              <Button
                size="small"
                icon={<CheckCircle size={14} />}
                onClick={() => handleStatusUpdate(record._id, "done")}
                style={{ color: "#22c55e" }}
              />
              <Button
                size="small"
                icon={<XCircle size={14} />}
                onClick={() => handleStatusUpdate(record._id, "canceled")}
                style={{ color: "#ef4444" }}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      {/* Welcome */}
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title level={3} style={{ color: theme.colors.text, margin: 0 }}>
              Welcome, {user?.name} 👋
            </Title>
            <Text style={{ color: theme.colors.textSecondary }}>
              Manage your blood donation requests
            </Text>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => navigate("/dashboard/add-request")}
              className="bg-red-500 border-red-500"
            >
              New Request
            </Button>
          </motion.div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <StaggerContainer>
        <Row gutter={[16, 16]} className="mb-6">
          {[
            {
              icon: Heart,
              title: "Total",
              value: stats.total,
              color: "#ef4444",
            },
            {
              icon: Clock,
              title: "Pending",
              value: stats.pending,
              color: "#eab308",
            },
            {
              icon: Activity,
              title: "In Progress",
              value: stats.inProgress,
              color: "#3b82f6",
            },
            {
              icon: CheckCircle,
              title: "Completed",
              value: stats.completed,
              color: "#22c55e",
            },
          ].map((stat) => (
            <Col xs={12} md={6} key={stat.title}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card style={cardStyle} className="border-0 shadow-sm">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${stat.color}15` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <stat.icon size={20} style={{ color: stat.color }} />
                      </motion.div>
                      <div>
                        <Text
                          style={{ color: theme.colors.textSecondary }}
                          className="text-xs"
                        >
                          {stat.title}
                        </Text>
                        <Title
                          level={4}
                          style={{ color: theme.colors.text, margin: 0 }}
                        >
                          <AnimatedCounter end={stat.value} duration={1.5} />
                        </Title>
                      </div>
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
          ))}
        </Row>
      </StaggerContainer>

      {/* Requests Table */}
      <Card
        style={cardStyle}
        className="border-0 shadow-sm"
        title={
          <Text strong style={{ color: theme.colors.text }}>
            Your Requests
          </Text>
        }
      >
        {requests.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={requests.slice(0, 5)}
              rowKey="_id"
              pagination={false}
              scroll={{ x: 600 }}
            />
            {stats.total > 5 && (
              <div className="text-center mt-4">
                <Button
                  type="link"
                  onClick={() => navigate("/dashboard/my-request")}
                >
                  View All {stats.total} Requests
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty description="No requests yet">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => navigate("/dashboard/add-request")}
              className="bg-red-500 border-red-500"
            >
              Create First Request
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default DonorDashboard;
