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
  Typography,
  Pagination,
  Table,
  Empty,
} from "antd";
import {
  FileText,
  Clock,
  CheckCircle,
  Activity,
  Eye,
  MapPin,
  Droplet,
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

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/donation-request?page=${currentPage}&size=10`
      );
      const allRequests = res.data.requests || [];
      setRequests(allRequests);
      setTotalItems(res.data.totalRequests || res.data.total || 0);
      setStats({
        pending: allRequests.filter((r) => r.donation_status === "pending")
          .length,
        inProgress: allRequests.filter(
          (r) => r.donation_status === "inprogress"
        ).length,
        completed: allRequests.filter((r) => r.donation_status === "done")
          .length,
        total: res.data.totalRequests || res.data.total || 0,
      });
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
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

  const columns = [
    {
      title: "Recipient",
      key: "recipient",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <Droplet size={14} className="text-red-500" />
          </div>
          <div>
            <Text strong style={{ color: theme.colors.text }}>
              {record.recipientName}
            </Text>
            <Text
              style={{ color: theme.colors.textSecondary }}
              className="text-xs block"
            >
              {record.blood_group}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <MapPin size={12} style={{ color: theme.colors.textSecondary }} />
          <Text
            style={{ color: theme.colors.textSecondary }}
            className="text-sm"
          >
            {record.district}, {record.upazila}
          </Text>
        </div>
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
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<Eye size={14} />}
          onClick={() => navigate(`/donation-request/${record._id}`)}
          className="bg-blue-500 border-blue-500"
        >
          View
        </Button>
      ),
    },
  ];

  if (loading && currentPage === 1) return <Loading />;

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      {/* Welcome */}
      <ScrollReveal>
        <div className="mb-6">
          <Title level={3} style={{ color: theme.colors.text, margin: 0 }}>
            Welcome, {user?.name} 🌟
          </Title>
          <Text style={{ color: theme.colors.textSecondary }}>
            Volunteer Dashboard - Help manage blood donation requests
          </Text>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <StaggerContainer>
        <Row gutter={[16, 16]} className="mb-6">
          {[
            {
              icon: FileText,
              title: "Total Requests",
              value: stats.total,
              color: "#8b5cf6",
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
            Blood Donation Requests
          </Text>
        }
      >
        {requests.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={requests}
              rowKey="_id"
              pagination={false}
              loading={loading}
              scroll={{ x: 600 }}
            />
            <div className="flex justify-center mt-4">
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={totalItems}
                pageSize={10}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty description="No blood requests found" />
        )}
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
