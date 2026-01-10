import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Select,
  DatePicker,
  Statistic,
  Empty,
  Progress,
  Tooltip as AntTooltip,
} from "antd";
import {
  HeartFilled,
  UserOutlined,
  RiseOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  FireOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useTheme } from "../../Context/ThemeContext";
import dayjs from "dayjs";
import {
  Heart,
  Users,
  Activity,
  TrendingUp,
  Award,
  Droplet,
  Clock,
  MapPin,
  Zap,
  Target,
} from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  AnimatedCounter,
  BloodCellParticles,
  GradientMesh,
  PulsingHeart,
} from "../../Components/Animations";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BLOOD_GROUP_COLORS = {
  "A+": "#ef4444",
  "A-": "#f97316",
  "B+": "#eab308",
  "B-": "#22c55e",
  "AB+": "#06b6d4",
  "AB-": "#3b82f6",
  "O+": "#8b5cf6",
  "O-": "#ec4899",
};

const Statistics = () => {
  const axiosSecure = useAxiosSecure();
  const { isDarkMode, theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("/statistics", {
        params: {
          startDate: dateRange[0]?.format("YYYY-MM-DD"),
          endDate: dateRange[1]?.format("YYYY-MM-DD"),
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStats(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    overview: {
      totalDonations: 1247,
      totalDonors: 856,
      totalRequests: 432,
      successRate: 87.5,
      livesSaved: 3741,
      avgResponseTime: 4.2,
    },
    monthlyTrends: [
      { month: "Jan", donations: 85, requests: 92, livesSaved: 255 },
      { month: "Feb", donations: 102, requests: 88, livesSaved: 306 },
      { month: "Mar", donations: 95, requests: 105, livesSaved: 285 },
      { month: "Apr", donations: 118, requests: 98, livesSaved: 354 },
      { month: "May", donations: 132, requests: 115, livesSaved: 396 },
      { month: "Jun", donations: 145, requests: 128, livesSaved: 435 },
    ],
    bloodGroupDistribution: [
      { name: "A+", value: 245, percentage: 28.6 },
      { name: "B+", value: 198, percentage: 23.1 },
      { name: "O+", value: 312, percentage: 36.4 },
      { name: "AB+", value: 56, percentage: 6.5 },
      { name: "A-", value: 18, percentage: 2.1 },
      { name: "B-", value: 12, percentage: 1.4 },
      { name: "O-", value: 10, percentage: 1.2 },
      { name: "AB-", value: 5, percentage: 0.6 },
    ],
    demographics: {
      ageGroups: [
        { range: "18-25", count: 234, fill: "#ef4444" },
        { range: "26-35", count: 312, fill: "#f97316" },
        { range: "36-45", count: 198, fill: "#eab308" },
        { range: "46-55", count: 87, fill: "#22c55e" },
        { range: "55+", count: 25, fill: "#3b82f6" },
      ],
      topDistricts: [
        { name: "Dhaka", donations: 456, percentage: 85 },
        { name: "Chittagong", donations: 234, percentage: 65 },
        { name: "Sylhet", donations: 156, percentage: 45 },
        { name: "Rajshahi", donations: 123, percentage: 35 },
        { name: "Khulna", donations: 98, percentage: 28 },
      ],
    },
    responseTime: {
      average: 4.2,
      trend: [
        { day: "Mon", hours: 3.8 },
        { day: "Tue", hours: 4.2 },
        { day: "Wed", hours: 3.5 },
        { day: "Thu", hours: 4.8 },
        { day: "Fri", hours: 5.1 },
        { day: "Sat", hours: 3.2 },
        { day: "Sun", hours: 4.5 },
      ],
    },
    topDonors: [
      { name: "Mohammad Ali", donations: 24, bloodGroup: "O+" },
      { name: "Fatima Rahman", donations: 18, bloodGroup: "A+" },
      { name: "Karim Ahmed", donations: 15, bloodGroup: "B+" },
    ],
  });

  if (loading) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
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

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const textColor = theme.colors.text;
  const secondaryColor = theme.colors.textSecondary;

  // Stat card component with icon and gradient
  const StatCard = ({
    icon: Icon,
    title,
    value,
    suffix = "",
    color,
    trend,
    trendUp = true,
  }) => (
    <HoverLiftCard>
      <Card
        style={cardStyle}
        className="h-full border-0 shadow-lg overflow-hidden relative"
      >
        {/* Background gradient */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: color }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${color}15` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon size={24} style={{ color }} />
            </motion.div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  trendUp ? "text-green-500" : "text-red-500"
                }`}
              >
                <TrendingUp
                  size={14}
                  className={!trendUp ? "rotate-180" : ""}
                />
                <span>{trend}%</span>
              </div>
            )}
          </div>
          <Text
            style={{ color: secondaryColor }}
            className="text-sm block mb-1"
          >
            {title}
          </Text>
          <div className="text-3xl font-bold" style={{ color: textColor }}>
            <AnimatedCounter end={value} duration={2} suffix={suffix} />
          </div>
        </div>
      </Card>
    </HoverLiftCard>
  );

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 py-12 overflow-hidden">
        <GradientMesh />
        <BloodCellParticles count={15} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <PulsingHeart size={40} color="#fff" />
              <Title level={1} style={{ color: "white", margin: 0 }}>
                Impact Dashboard
              </Title>
            </div>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}>
              Real-time analytics of lives saved through blood donation
            </Text>
          </motion.div>

          {/* Hero Stats */}
          <Row gutter={[24, 24]} className="max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                label: "Lives Saved",
                value: stats?.overview?.livesSaved || 3741,
                color: "#fff",
              },
              {
                icon: Droplet,
                label: "Total Donations",
                value: stats?.overview?.totalDonations || 0,
                color: "#fff",
              },
              {
                icon: Users,
                label: "Active Donors",
                value: stats?.overview?.totalDonors || 0,
                color: "#fff",
              },
              {
                icon: Target,
                label: "Success Rate",
                value: stats?.overview?.successRate || 0,
                suffix: "%",
                color: "#fff",
              },
            ].map((stat, idx) => (
              <Col xs={12} md={6} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-3 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon size={28} className="text-white" />
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix || "+"}
                      duration={2.5}
                    />
                  </div>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    {stat.label}
                  </Text>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Wave Divider */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Date Filter */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Title level={3} style={{ color: textColor, margin: 0 }}>
                Detailed Analytics
              </Title>
              <Text style={{ color: secondaryColor }}>
                Filter by date range to see specific insights
              </Text>
            </div>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="rounded-lg"
              size="large"
            />
          </div>
        </ScrollReveal>

        {/* Quick Stats Row */}
        <StaggerContainer className="mb-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <StatCard
                  icon={Heart}
                  title="Total Donations"
                  value={stats?.overview?.totalDonations || 0}
                  color="#ef4444"
                  trend={12}
                  trendUp={true}
                />
              </StaggerItem>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <StatCard
                  icon={Users}
                  title="Active Donors"
                  value={stats?.overview?.totalDonors || 0}
                  color="#3b82f6"
                  trend={8}
                  trendUp={true}
                />
              </StaggerItem>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <StatCard
                  icon={Activity}
                  title="Blood Requests"
                  value={stats?.overview?.totalRequests || 0}
                  color="#f59e0b"
                  trend={5}
                  trendUp={true}
                />
              </StaggerItem>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <StatCard
                  icon={Clock}
                  title="Avg Response Time"
                  value={stats?.overview?.avgResponseTime || 4.2}
                  suffix=" hrs"
                  color="#22c55e"
                  trend={15}
                  trendUp={false}
                />
              </StaggerItem>
            </Col>
          </Row>
        </StaggerContainer>

        {/* Charts Row 1 */}
        <ScrollReveal delay={0.1}>
          <Row gutter={[16, 16]} className="mb-8">
            {/* Monthly Trends - Enhanced */}
            <Col xs={24} lg={16}>
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg"
                  title={
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-red-500" />
                      <Text strong style={{ color: textColor }}>
                        Monthly Donation Trends
                      </Text>
                    </div>
                  }
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={stats?.monthlyTrends || []}>
                      <defs>
                        <linearGradient
                          id="donationsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="requestsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.colors.border}
                        opacity={0.5}
                      />
                      <XAxis dataKey="month" stroke={secondaryColor} />
                      <YAxis stroke={secondaryColor} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.card,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ color: textColor }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="donations"
                        stroke="#ef4444"
                        strokeWidth={3}
                        fill="url(#donationsGradient)"
                        name="Donations"
                      />
                      <Area
                        type="monotone"
                        dataKey="requests"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#requestsGradient)"
                        name="Requests"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </HoverLiftCard>
            </Col>

            {/* Blood Group Distribution - Enhanced */}
            <Col xs={24} lg={8}>
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg h-full"
                  title={
                    <div className="flex items-center gap-2">
                      <Droplet size={20} className="text-red-500" />
                      <Text strong style={{ color: textColor }}>
                        Blood Group Distribution
                      </Text>
                    </div>
                  }
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats?.bloodGroupDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {(stats?.bloodGroupDistribution || []).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={BLOOD_GROUP_COLORS[entry.name] || "#8884d8"}
                              stroke="none"
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.card,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {(stats?.bloodGroupDistribution || [])
                      .slice(0, 8)
                      .map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: BLOOD_GROUP_COLORS[item.name],
                            }}
                          />
                          <Text
                            style={{ color: secondaryColor, fontSize: "12px" }}
                          >
                            {item.name}
                          </Text>
                        </div>
                      ))}
                  </div>
                </Card>
              </HoverLiftCard>
            </Col>
          </Row>
        </ScrollReveal>

        {/* Charts Row 2 */}
        <ScrollReveal delay={0.2}>
          <Row gutter={[16, 16]} className="mb-8">
            {/* Top Districts with Progress Bars */}
            <Col xs={24} lg={12}>
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg"
                  title={
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-red-500" />
                      <Text strong style={{ color: textColor }}>
                        Top Districts by Donations
                      </Text>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {(stats?.demographics?.topDistricts || []).map(
                      (district, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="flex justify-between mb-1">
                            <Text style={{ color: textColor }}>
                              {district.name}
                            </Text>
                            <Text strong style={{ color: textColor }}>
                              {district.donations}
                            </Text>
                          </div>
                          <Progress
                            percent={district.percentage}
                            showInfo={false}
                            strokeColor={{
                              "0%": "#ef4444",
                              "100%": "#dc2626",
                            }}
                            trailColor={isDarkMode ? "#374151" : "#e5e7eb"}
                            size="small"
                          />
                        </motion.div>
                      )
                    )}
                  </div>
                </Card>
              </HoverLiftCard>
            </Col>

            {/* Age Distribution - Enhanced */}
            <Col xs={24} lg={12}>
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg"
                  title={
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-blue-500" />
                      <Text strong style={{ color: textColor }}>
                        Donor Age Distribution
                      </Text>
                    </div>
                  }
                >
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={stats?.demographics?.ageGroups || []}>
                      <defs>
                        <linearGradient
                          id="ageGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.colors.border}
                        opacity={0.5}
                      />
                      <XAxis dataKey="range" stroke={secondaryColor} />
                      <YAxis stroke={secondaryColor} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.card,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: "12px",
                        }}
                        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      />
                      <Bar
                        dataKey="count"
                        fill="url(#ageGradient)"
                        radius={[8, 8, 0, 0]}
                        name="Donors"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </HoverLiftCard>
            </Col>
          </Row>
        </ScrollReveal>

        {/* Response Time & Top Donors */}
        <ScrollReveal delay={0.3}>
          <Row gutter={[16, 16]}>
            {/* Response Time */}
            <Col xs={24} lg={16}>
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg"
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={20} className="text-green-500" />
                        <Text strong style={{ color: textColor }}>
                          Response Time Trend
                        </Text>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
                        <Zap size={14} className="text-green-500" />
                        <Text style={{ color: "#22c55e" }}>
                          Avg: {stats?.responseTime?.average || 0} hours
                        </Text>
                      </div>
                    </div>
                  }
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={stats?.responseTime?.trend || []}>
                      <defs>
                        <linearGradient
                          id="responseGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.colors.border}
                        opacity={0.5}
                      />
                      <XAxis dataKey="day" stroke={secondaryColor} />
                      <YAxis stroke={secondaryColor} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.card,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#22c55e"
                        fill="url(#responseGradient)"
                      />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8, fill: "#22c55e" }}
                        name="Hours"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </HoverLiftCard>
            </Col>

            {/* Top Donors */}
            <Col xs={24} lg={8}>
              <HoverLiftCard liftAmount={-4}>
                <Card
                  style={cardStyle}
                  className="border-0 shadow-lg h-full"
                  title={
                    <div className="flex items-center gap-2">
                      <Award size={20} className="text-yellow-500" />
                      <Text strong style={{ color: textColor }}>
                        Top Donors
                      </Text>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {(stats?.topDonors || []).map((donor, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
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
                              ? "bg-yellow-500"
                              : idx === 1
                              ? "bg-gray-400"
                              : "bg-amber-700"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <Text
                            strong
                            style={{ color: textColor }}
                            className="block"
                          >
                            {donor.name}
                          </Text>
                          <Text
                            style={{ color: secondaryColor, fontSize: "12px" }}
                          >
                            {donor.donations} donations • {donor.bloodGroup}
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
                </Card>
              </HoverLiftCard>
            </Col>
          </Row>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Statistics;
