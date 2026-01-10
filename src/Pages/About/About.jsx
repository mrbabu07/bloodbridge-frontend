import React from "react";
import { Typography, Row, Col, Card, Avatar, Space, Timeline } from "antd";
import { motion } from "framer-motion";
import {
  HeartFilled,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../Context/ThemeContext";
import { Heart, Target, Eye, Users, Award, Shield } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  BloodCellParticles,
  GradientMesh,
  AnimatedCounter,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;

const About = () => {
  const { isDarkMode, theme } = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const team = [
    {
      name: "Dr. Aminul Islam",
      role: "Founder & CEO",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Dr. Fatima Rahman",
      role: "Medical Director",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Mohammad Karim",
      role: "Operations Head",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      name: "Ayesha Begum",
      role: "Community Manager",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      desc: "BloodBridge was established with a mission to save lives",
    },
    {
      year: "2021",
      title: "1000+ Donors",
      desc: "Reached our first milestone of registered donors",
    },
    {
      year: "2022",
      title: "All 64 Districts",
      desc: "Expanded coverage to all districts of Bangladesh",
    },
    {
      year: "2023",
      title: "10,000+ Lives Saved",
      desc: "Celebrated saving over 10,000 lives",
    },
    {
      year: "2024",
      title: "AI Integration",
      desc: "Launched intelligent donor matching system",
    },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-20 overflow-hidden">
        <GradientMesh />
        <BloodCellParticles count={12} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Title level={1} style={{ color: "white", marginBottom: 16 }}>
              About BloodBridge
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "18px",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Connecting donors with those in need, saving lives one drop at a
              time across Bangladesh.
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]} className="max-w-5xl mx-auto">
            <Col xs={24} md={12}>
              <ScrollReveal direction="left">
                <HoverLiftCard>
                  <Card style={cardStyle} className="h-full border-0 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Target className="text-red-500" size={28} />
                      </motion.div>
                      <Title
                        level={3}
                        style={{ color: theme.colors.text, margin: 0 }}
                      >
                        Our Mission
                      </Title>
                    </div>
                    <Paragraph
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: "16px",
                      }}
                    >
                      To create a seamless, technology-driven platform that
                      connects blood donors with recipients instantly, ensuring
                      no life is lost due to blood shortage. We aim to build a
                      community of regular donors who understand the importance
                      of giving back.
                    </Paragraph>
                  </Card>
                </HoverLiftCard>
              </ScrollReveal>
            </Col>
            <Col xs={24} md={12}>
              <ScrollReveal direction="right">
                <HoverLiftCard>
                  <Card style={cardStyle} className="h-full border-0 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                      >
                        <Eye className="text-blue-500" size={28} />
                      </motion.div>
                      <Title
                        level={3}
                        style={{ color: theme.colors.text, margin: 0 }}
                      >
                        Our Vision
                      </Title>
                    </div>
                    <Paragraph
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: "16px",
                      }}
                    >
                      To become Bangladesh's most trusted blood donation
                      network, where every citizen has access to safe blood
                      within minutes of need. We envision a future where blood
                      shortage is a thing of the past.
                    </Paragraph>
                  </Card>
                </HoverLiftCard>
              </ScrollReveal>
            </Col>
          </Row>
        </div>
      </section>

      {/* Values */}
      <section className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Title level={2} style={{ color: theme.colors.text }}>
                Our Core Values
              </Title>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>
          <StaggerContainer className="max-w-5xl mx-auto">
            <Row gutter={[24, 24]}>
              {[
                {
                  icon: <Heart size={28} />,
                  title: "Compassion",
                  desc: "We care deeply about every life we help save",
                },
                {
                  icon: <Shield size={28} />,
                  title: "Safety",
                  desc: "Highest standards of medical safety and hygiene",
                },
                {
                  icon: <Users size={28} />,
                  title: "Community",
                  desc: "Building a strong network of caring individuals",
                },
                {
                  icon: <Award size={28} />,
                  title: "Excellence",
                  desc: "Striving for the best in everything we do",
                },
              ].map((value, idx) => (
                <Col xs={12} md={6} key={idx}>
                  <StaggerItem>
                    <HoverLiftCard>
                      <Card
                        style={cardStyle}
                        className="text-center h-full border-0 shadow-md"
                      >
                        <motion.div
                          className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-red-500"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {value.icon}
                        </motion.div>
                        <Title level={5} style={{ color: theme.colors.text }}>
                          {value.title}
                        </Title>
                        <Text style={{ color: theme.colors.textSecondary }}>
                          {value.desc}
                        </Text>
                      </Card>
                    </HoverLiftCard>
                  </StaggerItem>
                </Col>
              ))}
            </Row>
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} style={{ color: theme.colors.text }}>
              Our Journey
            </Title>
            <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="max-w-2xl mx-auto">
            <Timeline
              mode="alternate"
              items={milestones.map((m, idx) => ({
                color: "red",
                children: (
                  <Card style={cardStyle} className="border-0 shadow-md">
                    <Text strong style={{ color: "#dc2626" }}>
                      {m.year}
                    </Text>
                    <Title
                      level={5}
                      style={{ color: theme.colors.text, marginTop: 4 }}
                    >
                      {m.title}
                    </Title>
                    <Text style={{ color: theme.colors.textSecondary }}>
                      {m.desc}
                    </Text>
                  </Card>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Title level={2} style={{ color: theme.colors.text }}>
                Meet Our Team
              </Title>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>
          <StaggerContainer className="max-w-4xl mx-auto">
            <Row gutter={[24, 24]}>
              {team.map((member, idx) => (
                <Col xs={12} md={6} key={idx}>
                  <StaggerItem>
                    <HoverLiftCard>
                      <Card
                        style={cardStyle}
                        className="text-center border-0 shadow-md"
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Avatar
                            src={member.avatar}
                            size={80}
                            className="mb-4"
                          />
                        </motion.div>
                        <Title
                          level={5}
                          style={{ color: theme.colors.text, marginBottom: 4 }}
                        >
                          {member.name}
                        </Title>
                        <Text style={{ color: theme.colors.textSecondary }}>
                          {member.role}
                        </Text>
                      </Card>
                    </HoverLiftCard>
                  </StaggerItem>
                </Col>
              ))}
            </Row>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};

export default About;
