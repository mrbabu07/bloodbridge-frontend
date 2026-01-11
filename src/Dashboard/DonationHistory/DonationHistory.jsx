import { useState, useEffect } from "react";
import { useTheme } from "../../Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  Alert,
  Progress,
  Statistic,
  Row,
  Col,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartFilled,
  CalendarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  ScrollReveal,
  HoverLiftCard,
  AnimatedCounter,
  GradientMesh,
  PulsingHeart,
} from "../../Components/Animations";

const { Title, Text } = Typography;

const DonationHistory = () => {
  const { isDarkMode } = useTheme();
  const axiosSecure = useAxiosSecure();
  const [eligibility, setEligibility] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eligibilityRes, historyRes] = await Promise.all([
        axiosSecure.get("/donations/eligibility"),
        axiosSecure.get(
          `/donations/history?page=${pagination.current}&limit=${pagination.pageSize}`
        ),
      ]);

      setEligibility(eligibilityRes.data);
      setHistory(historyRes.data.donations);
      setPagination((prev) => ({
        ...prev,
        total: historyRes.data.total,
      }));
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Recipient",
      dataIndex: "recipientName",
      key: "recipient",
    },
    {
      title: "Blood Group",
      dataIndex: "blood_group",
      key: "bloodGroup",
      render: (bg) => (
        <Tag color="red" className="font-bold">
          {bg}
        </Tag>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <Space>
          <EnvironmentOutlined className="text-gray-400" />
          <Text>
            {record.district}
            {record.upazila && `, ${record.upazila}`}
          </Text>
        </Space>
      ),
    },
    {
      title: "Hospital",
      dataIndex: "hospital",
      key: "hospital",
      render: (hospital) => hospital || "N/A",
    },
    {
      title: "Status",
      dataIndex: "donation_status",
      key: "status",
      render: (status) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Completed
        </Tag>
      ),
    },
  ];

  const calculateProgress = () => {
    if (!eligibility?.daysSinceLastDonation) return 0;
    const progress =
      (eligibility.daysSinceLastDonation / eligibility.eligibilityPeriodDays) *
      100;
    return Math.min(100, Math.round(progress));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PulsingHeart size={64} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-6 p-8">
        <GradientMesh />
        <div className="relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <HeartFilled className="text-5xl text-red-600" />
              <div>
                <Title level={2} className={isDarkMode ? "text-white" : ""}>
                  Donation History
                </Title>
                <Text type="secondary" className="text-lg">
                  Track your blood donation journey
                </Text>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Eligibility Status */}
      <ScrollReveal delay={0.1}>
        <Card
          className={`mb-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <div className="h-full flex flex-col justify-center">
                <Title level={4} className={isDarkMode ? "text-white" : ""}>
                  Eligibility Status
                </Title>

                {eligibility?.isEligible ? (
                  <Alert
                    message="You are eligible to donate!"
                    description={eligibility.reason}
                    type="success"
                    icon={<CheckCircleOutlined />}
                    showIcon
                    className="mb-4"
                  />
                ) : (
                  <Alert
                    message="Not eligible yet"
                    description={eligibility?.reason}
                    type="warning"
                    icon={<ClockCircleOutlined />}
                    showIcon
                    className="mb-4"
                  />
                )}

                {eligibility?.lastDonationDate && (
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="flex justify-between">
                      <Text type="secondary">Last Donation:</Text>
                      <Text strong>
                        {new Date(
                          eligibility.lastDonationDate
                        ).toLocaleDateString()}
                      </Text>
                    </div>

                    {eligibility.nextEligibleDate && (
                      <div className="flex justify-between">
                        <Text type="secondary">Next Eligible Date:</Text>
                        <Text strong className="text-green-600">
                          {new Date(
                            eligibility.nextEligibleDate
                          ).toLocaleDateString()}
                        </Text>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <Text>Days since last donation</Text>
                        <Text strong>
                          {eligibility.daysSinceLastDonation} /{" "}
                          {eligibility.eligibilityPeriodDays} days
                        </Text>
                      </div>
                      <Progress
                        percent={calculateProgress()}
                        strokeColor={{
                          "0%": "#ef4444",
                          "100%": "#22c55e",
                        }}
                        status={eligibility.isEligible ? "success" : "active"}
                      />
                    </div>
                  </Space>
                )}
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <HoverLiftCard>
                    <Card
                      className={
                        isDarkMode ? "bg-gray-700 border-gray-600" : ""
                      }
                    >
                      <Statistic
                        title={
                          <span className={isDarkMode ? "text-gray-400" : ""}>
                            Total Donations
                          </span>
                        }
                        value={history.length}
                        prefix={<HeartFilled className="text-red-500" />}
                        valueStyle={{ color: "#ef4444" }}
                        formatter={(value) => <AnimatedCounter end={value} />}
                      />
                    </Card>
                  </HoverLiftCard>
                </Col>

                <Col xs={24} sm={12}>
                  <HoverLiftCard>
                    <Card
                      className={
                        isDarkMode ? "bg-gray-700 border-gray-600" : ""
                      }
                    >
                      <Statistic
                        title={
                          <span className={isDarkMode ? "text-gray-400" : ""}>
                            Lives Saved
                          </span>
                        }
                        value={history.length * 3}
                        prefix={<TrophyOutlined className="text-yellow-500" />}
                        valueStyle={{ color: "#eab308" }}
                        formatter={(value) => <AnimatedCounter end={value} />}
                      />
                    </Card>
                  </HoverLiftCard>
                </Col>
              </Row>

              <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                <Text className="block text-center italic">
                  "Each donation can save up to 3 lives. Thank you for being a
                  hero!"
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </ScrollReveal>

      {/* Donation History Table */}
      <ScrollReveal delay={0.2}>
        <HoverLiftCard>
          <Card
            title={
              <Space>
                <CalendarOutlined className="text-red-600" />
                <span>Your Donation History</span>
              </Space>
            }
            className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
          >
            {history.length > 0 ? (
              <Table
                columns={columns}
                dataSource={history}
                rowKey="_id"
                pagination={{
                  ...pagination,
                  onChange: (page) =>
                    setPagination((prev) => ({ ...prev, current: page })),
                  showSizeChanger: false,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} donations`,
                }}
                scroll={{ x: 800 }}
              />
            ) : (
              <Empty
                description="No donation history yet. Start your journey by donating blood!"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </HoverLiftCard>
      </ScrollReveal>
    </div>
  );
};

export default DonationHistory;
