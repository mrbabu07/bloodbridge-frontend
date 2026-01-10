import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Card, Row, Col, Typography, Button, Table, Empty } from "antd";
import {
  Users,
  DollarSign,
  FileText,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle,
  MapPin,
  Droplet,
} from "lucide-react";
import { motion } from "framer-motion";
import Loading from "../Pages/Loading";
import { useNavigate } from "react-router-dom";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  AnimatedCounter,
} from "../Components/Animations";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    totalRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axiosSecure.get("/admin-stats");
        setStats({
          totalUsers: statsRes.data.totalUsers || 0,
          totalFunding: statsRes.data.totalFunding || 0,
          totalRequests: statsRes.data.totalRequests || 0,
        });

        const requestsRes = await axiosSecure
          .get("/donation-request?page=1&size=5")
          .catch(() => ({ data: { requests: [] } }));
        setRecentRequests(requestsRes.data.requests || []);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load dashboard stats");
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  if (loading) return <Loading />;

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "12px",
  };

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <HoverLiftCard>
      <Card
        style={cardStyle}
        className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <Text
              style={{ color: theme.colors.textSecondary }}
              className="text-sm"
            >
              {title}
            </Text>
            <Title
              level={2}
              style={{ color: theme.colors.text, margin: "4px 0 0" }}
            >
              <AnimatedCounter end={value} duration={1.5} />
            </Title>
          </div>
          <motion.div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon size={24} style={{ color }} />
          </motion.div>
        </div>
      </Card>
    </HoverLiftCard>
  );

  const getStatusColor = (status) => {
    const colors = {
      done: "#22c55e",
      pending: "#eab308",
      inprogress: "#3b82f6",
      canceled: "#ef4444",
    };
    return colors[status] || "#6b7280";
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
        <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
          {record.district}
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
          type="link"
          size="small"
          onClick={() => navigate(`/donation-request/${record._id}`)}
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
      {/* Welcome */}
      <ScrollReveal>
        <div className="mb-6">
          <Title level={3} style={{ color: theme.colors.text, margin: 0 }}>
            Welcome back, {user?.name} 👋
          </Title>
          <Text style={{ color: theme.colors.textSecondary }}>
            Here's what's happening with your platform today.
          </Text>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <StaggerContainer>
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <StaggerItem>
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                color="#3b82f6"
                onClick={() => navigate("/dashboard/all-users")}
              />
            </StaggerItem>
          </Col>
          <Col xs={24} sm={8}>
            <StaggerItem>
              <StatCard
                icon={FileText}
                title="Blood Requests"
                value={stats.totalRequests}
                color="#ef4444"
                onClick={() => navigate("/dashboard/donation-request")}
              />
            </StaggerItem>
          </Col>
          <Col xs={24} sm={8}>
            <StaggerItem>
              <StatCard
                icon={DollarSign}
                title="Total Funding"
                value={stats.totalFunding}
                color="#22c55e"
                onClick={() => navigate("/dashboard/funding")}
              />
            </StaggerItem>
          </Col>
        </Row>
      </StaggerContainer>

      {/* Quick Actions & Recent Requests */}
      <ScrollReveal delay={0.2}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <HoverLiftCard liftAmount={-4}>
              <Card
                style={cardStyle}
                className="border-0 shadow-sm"
                title={
                  <Text strong style={{ color: theme.colors.text }}>
                    Quick Actions
                  </Text>
                }
              >
                <div className="space-y-3">
                  {[
                    {
                      icon: Users,
                      label: "Manage Users",
                      path: "/dashboard/all-users",
                      color: "#3b82f6",
                    },
                    {
                      icon: FileText,
                      label: "View Requests",
                      path: "/dashboard/donation-request",
                      color: "#ef4444",
                    },
                    {
                      icon: DollarSign,
                      label: "Funding",
                      path: "/dashboard/funding",
                      color: "#22c55e",
                    },
                  ].map((action) => (
                    <motion.button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${action.color}15` }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <action.icon
                            size={18}
                            style={{ color: action.color }}
                          />
                        </motion.div>
                        <Text style={{ color: theme.colors.text }}>
                          {action.label}
                        </Text>
                      </div>
                      <ArrowRight
                        size={16}
                        style={{ color: theme.colors.textSecondary }}
                      />
                    </motion.button>
                  ))}
                </div>
              </Card>
            </HoverLiftCard>
          </Col>

          <Col xs={24} lg={16}>
            <HoverLiftCard liftAmount={-4}>
              <Card
                style={cardStyle}
                className="border-0 shadow-sm"
                title={
                  <Text strong style={{ color: theme.colors.text }}>
                    Recent Requests
                  </Text>
                }
                extra={
                  <Button
                    type="link"
                    onClick={() => navigate("/dashboard/donation-request")}
                  >
                    View All
                  </Button>
                }
              >
                {recentRequests.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={recentRequests}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <Empty description="No recent requests" />
                )}
              </Card>
            </HoverLiftCard>
          </Col>
        </Row>
      </ScrollReveal>
    </div>
  );
};

export default AdminDashboard;
