import { useState, useEffect } from "react";
import { useTheme } from "../../Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Card,
  Progress,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Avatar,
  Empty,
} from "antd";
import {
  TrophyOutlined,
  FireOutlined,
  HeartFilled,
  CalendarOutlined,
  CrownOutlined,
  StarFilled,
} from "@ant-design/icons";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  AnimatedCounter,
  GradientMesh,
  PulsingHeart,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;

const Achievements = () => {
  const { isDarkMode } = useTheme();
  const axiosSecure = useAxiosSecure();
  const [achievements, setAchievements] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const [points, setPoints] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [achievementsRes, milestonesRes, pointsRes, leaderboardRes] =
        await Promise.all([
          axiosSecure.get("/achievements"),
          axiosSecure.get("/milestones"),
          axiosSecure.get("/points"),
          axiosSecure.get("/achievements/leaderboard?limit=10"),
        ]);

      setAchievements(achievementsRes.data);
      setMilestones(milestonesRes.data);
      setPoints(pointsRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (error) {
      console.error("Fetch achievements error:", error);
    } finally {
      setLoading(false);
    }
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
              <TrophyOutlined className="text-5xl text-yellow-500" />
              <div>
                <Title level={2} className={isDarkMode ? "text-white" : ""}>
                  Your Achievements
                </Title>
                <Text type="secondary" className="text-lg">
                  Track your impact and earn rewards
                </Text>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Stats Overview */}
      <ScrollReveal delay={0.1}>
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <HoverLiftCard>
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <Statistic
                  title={
                    <span className={isDarkMode ? "text-gray-400" : ""}>
                      Total Points
                    </span>
                  }
                  value={points?.total || 0}
                  prefix={<FireOutlined className="text-orange-500" />}
                  valueStyle={{ color: "#f97316" }}
                  formatter={(value) => <AnimatedCounter end={value} />}
                />
              </Card>
            </HoverLiftCard>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <HoverLiftCard>
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <Statistic
                  title={
                    <span className={isDarkMode ? "text-gray-400" : ""}>
                      Donations
                    </span>
                  }
                  value={achievements?.stats?.donationCount || 0}
                  prefix={<HeartFilled className="text-red-500" />}
                  valueStyle={{ color: "#ef4444" }}
                  formatter={(value) => <AnimatedCounter end={value} />}
                />
              </Card>
            </HoverLiftCard>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <HoverLiftCard>
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <Statistic
                  title={
                    <span className={isDarkMode ? "text-gray-400" : ""}>
                      Lives Saved
                    </span>
                  }
                  value={achievements?.stats?.livesSaved || 0}
                  prefix={<StarFilled className="text-yellow-500" />}
                  valueStyle={{ color: "#eab308" }}
                  formatter={(value) => <AnimatedCounter end={value} />}
                />
              </Card>
            </HoverLiftCard>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <HoverLiftCard>
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <Statistic
                  title={
                    <span className={isDarkMode ? "text-gray-400" : ""}>
                      Events Attended
                    </span>
                  }
                  value={achievements?.stats?.eventsAttended || 0}
                  prefix={<CalendarOutlined className="text-blue-500" />}
                  valueStyle={{ color: "#3b82f6" }}
                  formatter={(value) => <AnimatedCounter end={value} />}
                />
              </Card>
            </HoverLiftCard>
          </Col>
        </Row>
      </ScrollReveal>

      <Row gutter={[16, 16]}>
        {/* Milestones Progress */}
        <Col xs={24} lg={12}>
          <ScrollReveal delay={0.2}>
            <HoverLiftCard>
              <Card
                title={
                  <Space>
                    <CrownOutlined className="text-yellow-500" />
                    <span>Your Level</span>
                  </Space>
                }
                className={`h-full ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : ""
                }`}
              >
                {milestones?.currentLevel ? (
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-2">
                        {milestones.currentLevel.badge}
                      </div>
                      <Title
                        level={3}
                        className={isDarkMode ? "text-white" : ""}
                      >
                        {milestones.currentLevel.level}
                      </Title>
                      <Text type="secondary">
                        {milestones.donationCount} donations completed
                      </Text>
                    </div>

                    {milestones.nextLevel && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <Text>Progress to {milestones.nextLevel.level}</Text>
                          <Text strong>{milestones.progress}%</Text>
                        </div>
                        <Progress
                          percent={milestones.progress}
                          strokeColor={{
                            "0%": "#ef4444",
                            "100%": "#f97316",
                          }}
                          showInfo={false}
                        />
                        <Text type="secondary" className="text-sm mt-2 block">
                          {milestones.donationsToNextLevel} more donations to
                          reach {milestones.nextLevel.level}
                        </Text>
                      </div>
                    )}
                  </div>
                ) : (
                  <Empty description="Start donating to unlock levels!" />
                )}
              </Card>
            </HoverLiftCard>
          </ScrollReveal>
        </Col>

        {/* Points Breakdown */}
        <Col xs={24} lg={12}>
          <ScrollReveal delay={0.3}>
            <HoverLiftCard>
              <Card
                title={
                  <Space>
                    <FireOutlined className="text-orange-500" />
                    <span>Points Breakdown</span>
                  </Space>
                }
                className={`h-full ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : ""
                }`}
              >
                <Space direction="vertical" size="large" className="w-full">
                  <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <Text strong className="block">
                        Blood Donations
                      </Text>
                      <Text type="secondary">
                        {points?.donations?.count || 0} donations
                      </Text>
                    </div>
                    <Text className="text-2xl font-bold text-red-600">
                      {points?.donations?.points || 0}
                    </Text>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <Text strong className="block">
                        Events Attended
                      </Text>
                      <Text type="secondary">
                        {points?.events?.count || 0} events
                      </Text>
                    </div>
                    <Text className="text-2xl font-bold text-blue-600">
                      {points?.events?.points || 0}
                    </Text>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                    <Text strong className="text-lg">
                      Total Points
                    </Text>
                    <Text className="text-3xl font-bold text-orange-600">
                      {points?.total || 0}
                    </Text>
                  </div>
                </Space>
              </Card>
            </HoverLiftCard>
          </ScrollReveal>
        </Col>

        {/* Earned Badges */}
        <Col xs={24} lg={12}>
          <ScrollReveal delay={0.4}>
            <HoverLiftCard>
              <Card
                title={
                  <Space>
                    <TrophyOutlined className="text-yellow-500" />
                    <span>Earned Badges</span>
                  </Space>
                }
                className={`h-full ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : ""
                }`}
              >
                {achievements?.earnedBadges?.length > 0 ? (
                  <StaggerContainer className="grid grid-cols-2 gap-4">
                    {achievements.earnedBadges.map((badge) => (
                      <StaggerItem key={badge.id}>
                        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <Text strong className="block">
                            {badge.name}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {badge.description}
                          </Text>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                ) : (
                  <Empty description="No badges earned yet. Start donating!" />
                )}
              </Card>
            </HoverLiftCard>
          </ScrollReveal>
        </Col>

        {/* Available Badges */}
        <Col xs={24} lg={12}>
          <ScrollReveal delay={0.5}>
            <HoverLiftCard>
              <Card
                title={
                  <Space>
                    <StarFilled className="text-gray-400" />
                    <span>Locked Badges</span>
                  </Space>
                }
                className={`h-full ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : ""
                }`}
              >
                {achievements?.availableBadges?.length > 0 ? (
                  <StaggerContainer className="grid grid-cols-2 gap-4">
                    {achievements.availableBadges.map((badge) => (
                      <StaggerItem key={badge.id}>
                        <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-xl opacity-60">
                          <div className="text-4xl mb-2 grayscale">
                            {badge.icon}
                          </div>
                          <Text strong className="block">
                            {badge.name}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {badge.description}
                          </Text>
                          <Tag color="orange" className="mt-2">
                            {badge.requirement} required
                          </Tag>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                ) : (
                  <Empty description="All badges unlocked! 🎉" />
                )}
              </Card>
            </HoverLiftCard>
          </ScrollReveal>
        </Col>

        {/* Leaderboard */}
        <Col xs={24}>
          <ScrollReveal delay={0.6}>
            <HoverLiftCard>
              <Card
                title={
                  <Space>
                    <CrownOutlined className="text-yellow-500" />
                    <span>Top Achievers</span>
                  </Space>
                }
                className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
              >
                {leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.map((user, idx) => (
                      <div
                        key={user.email}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          idx < 3
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                            : isDarkMode
                            ? "bg-gray-700"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`text-2xl font-bold ${
                              idx === 0
                                ? "text-yellow-500"
                                : idx === 1
                                ? "text-gray-400"
                                : idx === 2
                                ? "text-orange-600"
                                : "text-gray-500"
                            }`}
                          >
                            #{user.rank}
                          </div>
                          <Avatar
                            src={user.avatar}
                            size={48}
                            icon={<TrophyOutlined />}
                          />
                          <div>
                            <Text strong className="block">
                              {user.name}
                            </Text>
                            <Space size="small">
                              <Tag color="red">{user.bloodGroup}</Tag>
                              <Text type="secondary" className="text-sm">
                                {user.donationCount} donations
                              </Text>
                            </Space>
                          </div>
                        </div>
                        <div className="text-right">
                          <Text className="text-2xl font-bold text-orange-600">
                            {user.points}
                          </Text>
                          <Text type="secondary" className="block text-sm">
                            points
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="No leaderboard data yet" />
                )}
              </Card>
            </HoverLiftCard>
          </ScrollReveal>
        </Col>
      </Row>
    </div>
  );
};

export default Achievements;
