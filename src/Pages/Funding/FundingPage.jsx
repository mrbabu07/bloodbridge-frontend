import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import {
  Table,
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Avatar,
  Pagination,
  Progress,
  Empty,
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  PlusOutlined,
  HeartFilled,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Heart,
  DollarSign,
  Users,
  Gift,
  Award,
  Sparkles,
  Target,
} from "lucide-react";
import Loading from "../Loading";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  AnimatedCounter,
  BloodCellParticles,
  GradientMesh,
  RippleButton,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;

const FundingPage = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFunds, setTotalFunds] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [topDonors, setTopDonors] = useState([]);
  const pageSize = 8;
  const fundingGoal = 500000;
  const progressPercent = Math.min((totalFunds / fundingGoal) * 100, 100);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const [recordsRes, summaryRes] = await Promise.all([
          axios.get(`/payment-records?page=${currentPage}&size=${pageSize}`),
          axios.get("/funding/summary"),
        ]);
        const donationsList = recordsRes.data.donations || [];
        setDonations(donationsList);
        setTotalItems(recordsRes.data.total || 0);
        setTotalFunds(summaryRes.data.total || 0);
        const donorMap = {};
        donationsList.forEach((d) => {
          const key = d.donorEmail || "anonymous";
          if (!donorMap[key]) {
            donorMap[key] = {
              name: d.donorName || "Anonymous",
              email: d.donorEmail,
              total: 0,
              count: 0,
            };
          }
          donorMap[key].total += d.amount || 0;
          donorMap[key].count += 1;
        });
        setTopDonors(
          Object.values(donorMap)
            .sort((a, b) => b.total - a.total)
            .slice(0, 3)
        );
      } catch (err) {
        toast.error("Failed to load funding data");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [axios, currentPage]);

  const handleGiveFund = () => {
    if (!user) {
      toast.error("Please log in to donate");
      navigate("/login");
      return;
    }
    navigate("/funding");
  };

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const columns = [
    {
      title: "Donor",
      dataIndex: "donorName",
      key: "donor",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Avatar
              src={record.donorAvatar}
              icon={<UserOutlined />}
              size={44}
              className="bg-gradient-to-br from-red-500 to-pink-500"
            >
              {(text || "A").charAt(0).toUpperCase()}
            </Avatar>
          </motion.div>
          <div>
            <Text strong style={{ color: theme.colors.text }}>
              {text || "Anonymous"}
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: "12px",
                display: "block",
              }}
            >
              {record.donorEmail}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <motion.span
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-sm shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <DollarSign size={14} /> ৳ {amount?.toLocaleString()}
        </motion.span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => (
        <div
          className="flex items-center gap-2"
          style={{ color: theme.colors.textSecondary }}
        >
          <CalendarOutlined />
          {date
            ? new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
          Completed
        </span>
      ),
    },
  ];

  if (loading && currentPage === 1 && donations.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Heart size={64} className="text-red-500" fill="#ef4444" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-pink-700 py-12 overflow-hidden">
        <GradientMesh />
        <BloodCellParticles count={15} />
        <div className="container mx-auto px-4 relative z-10">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={14}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Gift size={24} className="text-white" />
                  </motion.div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    Every Contribution Matters
                  </span>
                </div>
                <Title
                  level={1}
                  style={{ color: "white", margin: 0, marginBottom: 16 }}
                >
                  Support Our <br />
                  <span className="text-red-200">Life-Saving Mission</span>
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "18px",
                    marginBottom: 24,
                  }}
                >
                  Your generous donations help us maintain this platform,
                  organize blood drives, and save thousands of lives across
                  Bangladesh.
                </Paragraph>
                <RippleButton
                  onClick={handleGiveFund}
                  className="bg-white text-red-600 hover:bg-red-50 h-14 px-8 font-bold rounded-xl shadow-xl flex items-center gap-2 text-lg"
                >
                  <Heart size={20} fill="#dc2626" /> Make a Donation
                </RippleButton>
              </motion.div>
            </Col>
            <Col xs={24} lg={10}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                      Funding Progress
                    </Text>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Target size={20} className="text-yellow-300" />
                    </motion.div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    ৳ <AnimatedCounter end={totalFunds} duration={2} />
                  </div>
                  <Text style={{ color: "rgba(255,255,255,0.7)" }}>
                    raised of ৳{fundingGoal.toLocaleString()} goal
                  </Text>
                  <div className="mt-4 mb-2">
                    <Progress
                      percent={progressPercent}
                      showInfo={false}
                      strokeColor={{ "0%": "#fbbf24", "100%": "#f59e0b" }}
                      trailColor="rgba(255,255,255,0.2)"
                      strokeWidth={12}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text style={{ color: "rgba(255,255,255,0.7)" }}>
                      {progressPercent.toFixed(1)}% Complete
                    </Text>
                    <Text style={{ color: "#fbbf24" }}>
                      <AnimatedCounter end={totalItems} duration={1.5} /> donors
                    </Text>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-16"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
              fill={isDarkMode ? "#111827" : "#f9fafb"}
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer className="mb-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    style={cardStyle}
                    className="border-0 shadow-lg text-center"
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <DollarSign size={28} className="text-white" />
                    </motion.div>
                    <Text
                      style={{ color: theme.colors.textSecondary }}
                      className="block mb-2"
                    >
                      Total Funds Raised
                    </Text>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "#22c55e" }}
                    >
                      ৳ <AnimatedCounter end={totalFunds} duration={2} />
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={8}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    style={cardStyle}
                    className="border-0 shadow-lg text-center"
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <Heart size={28} className="text-white" fill="white" />
                    </motion.div>
                    <Text
                      style={{ color: theme.colors.textSecondary }}
                      className="block mb-2"
                    >
                      Total Contributions
                    </Text>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "#ef4444" }}
                    >
                      <AnimatedCounter end={totalItems} duration={2} />
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={8}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    style={cardStyle}
                    className="border-0 shadow-lg text-center"
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Users size={28} className="text-white" />
                    </motion.div>
                    <Text
                      style={{ color: theme.colors.textSecondary }}
                      className="block mb-2"
                    >
                      Unique Donors
                    </Text>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: "#8b5cf6" }}
                    >
                      <AnimatedCounter
                        end={topDonors.length > 0 ? totalItems : 0}
                        duration={2}
                      />
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
          </Row>
        </StaggerContainer>

        {/* Top Donors & Recent Donations */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <ScrollReveal direction="left">
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg h-full"
                  title={
                    <div className="flex items-center gap-2">
                      <Award size={20} className="text-yellow-500" />
                      <Text strong style={{ color: theme.colors.text }}>
                        Top Donors
                      </Text>
                    </div>
                  }
                >
                  {topDonors.length > 0 ? (
                    <div className="space-y-4">
                      {topDonors.map((donor, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.02)",
                          }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              idx === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : idx === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-500"
                                : "bg-gradient-to-br from-amber-600 to-amber-800"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Text
                              strong
                              style={{ color: theme.colors.text }}
                              className="block truncate"
                            >
                              {donor.name}
                            </Text>
                            <Text
                              style={{
                                color: theme.colors.textSecondary,
                                fontSize: "12px",
                              }}
                            >
                              ৳{donor.total.toLocaleString()} • {donor.count}{" "}
                              donations
                            </Text>
                          </div>
                          <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                            {idx === 0 && (
                              <TrophyOutlined className="text-yellow-500 text-xl" />
                            )}
                            {idx === 1 && (
                              <TrophyOutlined className="text-gray-400 text-xl" />
                            )}
                            {idx === 2 && (
                              <TrophyOutlined className="text-amber-700 text-xl" />
                            )}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No donors yet" />
                  )}
                  <motion.div
                    className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-red-500" />
                      <div>
                        <Text
                          strong
                          style={{ color: theme.colors.text }}
                          className="block"
                        >
                          Be a Top Donor!
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.textSecondary,
                            fontSize: "12px",
                          }}
                        >
                          Your name could be here
                        </Text>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </HoverLiftCard>
            </ScrollReveal>
          </Col>

          <Col xs={24} lg={16}>
            <ScrollReveal direction="right">
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg"
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift size={20} className="text-red-500" />
                        <Text strong style={{ color: theme.colors.text }}>
                          Recent Donations
                        </Text>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={handleGiveFund}
                          className="bg-red-500 border-red-500 rounded-lg"
                        >
                          Donate Now
                        </Button>
                      </motion.div>
                    </div>
                  }
                >
                  <Table
                    columns={columns}
                    dataSource={donations}
                    rowKey={(record, idx) => record._id || idx}
                    pagination={false}
                    loading={loading}
                    scroll={{ x: 600 }}
                  />
                  {totalItems > pageSize && (
                    <div className="mt-6 flex justify-center">
                      <Pagination
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                      />
                    </div>
                  )}
                </Card>
              </HoverLiftCard>
            </ScrollReveal>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FundingPage;
