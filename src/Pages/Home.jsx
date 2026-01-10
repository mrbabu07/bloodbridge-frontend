// BloodBridge Home Page - Comprehensive with Animations & Dynamic Data
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Heart,
  Clock,
  Users,
  Shield,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  CheckCircle,
  Droplet,
  Activity,
  Globe,
  Zap,
  Target,
  Gift,
  Calendar,
  ArrowRight,
  Play,
  X,
} from "lucide-react";
import {
  Button,
  Form,
  Input,
  Typography,
  Row,
  Col,
  Card,
  Space,
  message,
  Collapse,
  Avatar,
  Progress,
  Modal,
} from "antd";
import {
  SendOutlined,
  QuestionCircleOutlined,
  HeartFilled,
  SafetyCertificateOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import useAxios from "../hooks/useAxios";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  FloatingElement,
  RippleButton,
  HoverLiftCard,
  BloodCellParticles,
  GlassCard,
  GradientMesh,
  AnimatedBloodDrop,
  PulsingHeart,
  HeartbeatLine,
} from "../Components/Animations";
import { SkeletonCard } from "../Components/Loading/BloodLoader";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Home = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const navigate = useNavigate();
  const axios = useAxios();
  const heroRef = useRef(null);

  // Dynamic Data States
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [contactForm] = Form.useForm();
  const [contactLoading, setContactLoading] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Fetch all dynamic data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchRecentRequests(),
      fetchTestimonials(),
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await axios.get("/public-stats");
      setStats(res.data);
    } catch {
      // Fallback to calculated defaults
      setStats({ donors: 0, donations: 0, requests: 0, lives: 0 });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecentRequests = async () => {
    try {
      const res = await axios.get("/donation-request?size=6&status=pending");
      setRecentRequests(res.data.requests || []);
    } catch {
      setRecentRequests([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/testimonials");
      setTestimonials(res.data || []);
    } catch {
      // Use dynamic placeholder testimonials
      setTestimonials([]);
    }
  };

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail) {
      message.warning("Please enter your email address");
      return;
    }
    setNewsletterLoading(true);
    try {
      await axios.post("/newsletter/subscribe", { email: newsletterEmail });
      message.success("Successfully subscribed to newsletter!");
      setNewsletterEmail("");
    } catch (error) {
      if (error.response?.data?.error === "Already subscribed") {
        message.info("You're already subscribed!");
      } else {
        message.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setNewsletterLoading(false);
    }
  };

  const onContactFinish = async (values) => {
    setContactLoading(true);
    try {
      await axios.post("/contact", values);
      message.success("Message sent successfully! We'll get back to you soon.");
      contactForm.resetFields();
    } catch {
      message.error("Failed to send message. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

  // Styles
  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const sectionBg = isDarkMode ? "bg-gray-800" : "bg-slate-50";
  const sectionBgAlt = isDarkMode ? "bg-gray-900" : "bg-white";

  // Blood group data
  const bloodGroups = [
    {
      type: "O-",
      canGive: "All Types",
      canReceive: "O-",
      color: "#dc2626",
      urgency: "Critical",
    },
    {
      type: "O+",
      canGive: "O+, A+, B+, AB+",
      canReceive: "O+, O-",
      color: "#ea580c",
      urgency: "High",
    },
    {
      type: "A-",
      canGive: "A-, A+, AB-, AB+",
      canReceive: "A-, O-",
      color: "#ca8a04",
      urgency: "Medium",
    },
    {
      type: "A+",
      canGive: "A+, AB+",
      canReceive: "A+, A-, O+, O-",
      color: "#16a34a",
      urgency: "Normal",
    },
    {
      type: "B-",
      canGive: "B-, B+, AB-, AB+",
      canReceive: "B-, O-",
      color: "#0891b2",
      urgency: "Medium",
    },
    {
      type: "B+",
      canGive: "B+, AB+",
      canReceive: "B+, B-, O+, O-",
      color: "#2563eb",
      urgency: "Normal",
    },
    {
      type: "AB-",
      canGive: "AB-, AB+",
      canReceive: "All Negative",
      color: "#7c3aed",
      urgency: "Low",
    },
    {
      type: "AB+",
      canGive: "AB+ Only",
      canReceive: "All Types",
      color: "#db2777",
      urgency: "Low",
    },
  ];

  // FAQ data
  const faqs = [
    {
      q: "Who can donate blood?",
      a: "Anyone between 18-65 years old, weighing at least 50kg, and in good health can donate blood. You should not have donated blood in the last 3 months.",
    },
    {
      q: "How long does the donation process take?",
      a: "The entire process takes about 30-45 minutes, including registration, health screening, donation (8-10 minutes), and refreshments.",
    },
    {
      q: "Is blood donation safe?",
      a: "Yes, blood donation is completely safe. We use sterile, single-use equipment for each donor. Your body replenishes the donated blood within 24-48 hours.",
    },
    {
      q: "How often can I donate blood?",
      a: "You can donate whole blood every 3 months (90 days). Platelet donors can donate more frequently, up to 24 times per year.",
    },
    {
      q: "What blood types are most needed?",
      a: "All blood types are needed, but O-negative (universal donor) and AB-positive (universal plasma donor) are always in high demand.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* ============ HERO SECTION ============ */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ y: heroY }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900">
          <GradientMesh />
          <BloodCellParticles count={20} />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <motion.div
          className="container mx-auto px-4 py-20 relative z-10"
          style={{ opacity: heroOpacity }}
        >
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Trust Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlassCard className="px-4 py-2 flex items-center gap-2">
                    <PulsingHeart size={20} color="#fff" />
                    <span className="text-white font-semibold text-sm">
                      Trusted by {stats?.donors?.toLocaleString() || "2,500"}+
                      Donors
                    </span>
                  </GlassCard>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Every Drop
                  <motion.span
                    className="block text-red-200 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Saves Lives
                  </motion.span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  className="text-lg md:text-xl text-red-100/90 mb-8 max-w-xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Join Bangladesh's largest blood donation network. Connect with
                  donors, save lives, and be a hero in someone's story today.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {!user ? (
                    <>
                      <RippleButton
                        onClick={() => navigate("/register")}
                        className="bg-white text-red-600 hover:bg-red-50 h-14 px-8 font-bold rounded-xl shadow-xl flex items-center gap-2 text-lg"
                      >
                        <Heart size={20} /> Become a Donor
                      </RippleButton>
                      <RippleButton
                        onClick={() => navigate("/donation-request")}
                        className="bg-transparent text-white border-2 border-white/80 hover:bg-white/10 h-14 px-8 font-semibold rounded-xl flex items-center gap-2"
                      >
                        Request Blood <ArrowRight size={18} />
                      </RippleButton>
                    </>
                  ) : (
                    <RippleButton
                      onClick={() => navigate("/dashboard")}
                      className="bg-white text-red-600 hover:bg-red-50 h-14 px-8 font-bold rounded-xl shadow-xl flex items-center gap-2 text-lg"
                    >
                      Go to Dashboard <ArrowRight size={20} />
                    </RippleButton>
                  )}
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  className="flex flex-wrap gap-6 mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {[
                    {
                      label: "Lives Saved",
                      value: stats?.lives || 0,
                      suffix: "+",
                    },
                    {
                      label: "Active Donors",
                      value: stats?.donors || 0,
                      suffix: "+",
                    },
                    { label: "Success Rate", value: 98, suffix: "%" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        <AnimatedCounter
                          end={stat.value}
                          suffix={stat.suffix}
                          duration={2.5}
                        />
                      </div>
                      <div className="text-red-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </Col>

            {/* Hero Visual */}
            <Col xs={24} lg={12}>
              <motion.div
                className="hidden lg:flex justify-center items-center relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Floating Blood Drop */}
                <FloatingElement duration={4} distance={15}>
                  <div className="relative">
                    <AnimatedBloodDrop size={180} />

                    {/* Orbiting elements */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 8 + i * 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <motion.div
                          style={{
                            position: "absolute",
                            top: -80 - i * 30,
                          }}
                        >
                          {i === 0 && (
                            <Heart
                              className="text-white"
                              size={20}
                              fill="white"
                            />
                          )}
                          {i === 1 && (
                            <Droplet
                              className="text-white"
                              size={20}
                              fill="white"
                            />
                          )}
                          {i === 2 && (
                            <Activity className="text-white" size={20} />
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </FloatingElement>

                {/* Heartbeat Line */}
                <div className="absolute bottom-0 left-0 right-0">
                  <HeartbeatLine
                    width={400}
                    height={80}
                    color="rgba(255,255,255,0.3)"
                  />
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <motion.path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
              fill={isDarkMode ? "#1f2937" : "#f8fafc"}
              initial={{
                d: "M0 120L60 120C120 120 240 120 360 120C480 120 600 120 720 120C840 120 960 120 1080 120C1200 120 1320 120 1380 120L1440 120V120H0Z",
              }}
              animate={{
                d: "M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z",
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </div>
      </motion.section>

      {/* ============ LIVE STATISTICS SECTION ============ */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Title
                level={2}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                Real-Time Impact
              </Title>
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
              >
                See the difference we're making together
              </Text>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Users size={36} />,
                value: stats?.donors || 0,
                label: "Registered Donors",
                color: "#3b82f6",
              },
              {
                icon: <Heart size={36} />,
                value: stats?.donations || 0,
                label: "Successful Donations",
                color: "#ef4444",
              },
              {
                icon: <Activity size={36} />,
                value: stats?.requests || 0,
                label: "Blood Requests",
                color: "#f59e0b",
              },
              {
                icon: <Award size={36} />,
                value: stats?.lives || 0,
                label: "Lives Saved",
                color: "#10b981",
              },
            ].map((stat, idx) => (
              <StaggerItem key={idx}>
                <HoverLiftCard>
                  <Card
                    style={cardStyle}
                    className="text-center h-full border-0 shadow-lg overflow-hidden relative"
                  >
                    {/* Background Glow */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: stat.color }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="mb-4 inline-flex p-4 rounded-2xl"
                        style={{ backgroundColor: `${stat.color}15` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div style={{ color: stat.color }}>{stat.icon}</div>
                      </motion.div>

                      <div
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ color: theme.colors.text }}
                      >
                        {statsLoading ? (
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            ---
                          </motion.span>
                        ) : (
                          <AnimatedCounter
                            end={stat.value}
                            suffix="+"
                            duration={2}
                          />
                        )}
                      </div>
                      <Text style={{ color: theme.colors.textSecondary }}>
                        {stat.label}
                      </Text>
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ WHY DONATE SECTION ============ */}
      <section className={`py-20 ${sectionBgAlt}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Title
                level={2}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                Why Donate Blood?
              </Title>
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
              >
                Your donation can make a life-changing difference
              </Text>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            staggerDelay={0.1}
          >
            {[
              {
                icon: <Heart size={32} />,
                title: "Save 3 Lives",
                desc: "One donation can save up to 3 lives. Be a hero in someone's story.",
                color: "#ef4444",
              },
              {
                icon: <Clock size={32} />,
                title: "Quick & Safe",
                desc: "The process takes only 30 minutes with trained medical professionals.",
                color: "#3b82f6",
              },
              {
                icon: <Shield size={32} />,
                title: "Health Benefits",
                desc: "Regular donation reduces iron overload and improves cardiovascular health.",
                color: "#10b981",
              },
              {
                icon: <Users size={32} />,
                title: "Community Impact",
                desc: "Strengthen your community by ensuring blood is available when needed.",
                color: "#8b5cf6",
              },
              {
                icon: <Award size={32} />,
                title: "Free Health Check",
                desc: "Get a mini health screening including blood pressure and hemoglobin levels.",
                color: "#f59e0b",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Always Needed",
                desc: "Blood cannot be manufactured. Donors are the only source of this vital resource.",
                color: "#ec4899",
              },
            ].map((feature, idx) => (
              <StaggerItem key={idx}>
                <HoverLiftCard>
                  <Card style={cardStyle} className="h-full border-0 shadow-md">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${feature.color}15` }}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                      >
                        <div style={{ color: feature.color }}>
                          {feature.icon}
                        </div>
                      </motion.div>
                      <div>
                        <Title
                          level={5}
                          style={{ color: theme.colors.text, marginBottom: 4 }}
                        >
                          {feature.title}
                        </Title>
                        <Text style={{ color: theme.colors.textSecondary }}>
                          {feature.desc}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ HOW IT WORKS SECTION ============ */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Title
                level={2}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                How It Works
              </Title>
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
              >
                Simple steps to save a life
              </Text>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto">
            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              staggerDelay={0.15}
            >
              {[
                {
                  step: "01",
                  title: "Register",
                  desc: "Create your account and complete your donor profile with blood group and location.",
                  icon: <Users size={28} />,
                },
                {
                  step: "02",
                  title: "Get Matched",
                  desc: "Our system matches you with nearby blood requests based on compatibility.",
                  icon: <Target size={28} />,
                },
                {
                  step: "03",
                  title: "Donate",
                  desc: "Visit the hospital or blood bank and complete your donation safely.",
                  icon: <Gift size={28} />,
                },
                {
                  step: "04",
                  title: "Save Lives",
                  desc: "Your donation reaches those in need and helps save precious lives.",
                  icon: <Heart size={28} />,
                },
              ].map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className="text-center relative">
                    {/* Connector Line */}
                    {idx < 3 && (
                      <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-red-500 to-red-300 opacity-30" />
                    )}

                    <motion.div
                      className="relative inline-block mb-6"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-500 font-bold text-sm shadow-md">
                        {item.step}
                      </div>
                    </motion.div>

                    <Title level={4} style={{ color: theme.colors.text }}>
                      {item.title}
                    </Title>
                    <Text style={{ color: theme.colors.textSecondary }}>
                      {item.desc}
                    </Text>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ============ URGENT REQUESTS SECTION ============ */}
      {recentRequests.length > 0 && (
        <section className={`py-20 ${sectionBgAlt}`}>
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div>
                  <Title
                    level={2}
                    style={{ color: theme.colors.text, marginBottom: 8 }}
                  >
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🩸
                      </motion.span>
                      Urgent Blood Requests
                    </span>
                  </Title>
                  <Text style={{ color: theme.colors.textSecondary }}>
                    These patients need your help right now
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/donation-request")}
                  className="bg-red-500 border-red-500 mt-4 md:mt-0"
                >
                  View All Requests
                </Button>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRequests.slice(0, 6).map((request, idx) => (
                <StaggerItem key={request._id || idx}>
                  <HoverLiftCard>
                    <Card
                      style={cardStyle}
                      className="border-0 shadow-lg overflow-hidden"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                          {request.blood_group}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text
                            strong
                            style={{
                              color: theme.colors.text,
                              display: "block",
                            }}
                            className="truncate"
                          >
                            {request.patient_name || "Patient"}
                          </Text>
                          <Text
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: "12px",
                            }}
                            className="flex items-center gap-1"
                          >
                            <MapPin size={12} /> {request.district},{" "}
                            {request.upazila}
                          </Text>
                          <Text
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: "12px",
                            }}
                            className="flex items-center gap-1"
                          >
                            <Calendar size={12} />{" "}
                            {new Date(
                              request.donation_date
                            ).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        block
                        className="mt-4 bg-red-500 border-red-500"
                        onClick={() =>
                          navigate(`/donation-request/${request._id}`)
                        }
                      >
                        Donate Now
                      </Button>
                    </Card>
                  </HoverLiftCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ============ BLOOD GROUP COMPATIBILITY ============ */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Title
                level={2}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                Blood Group Compatibility
              </Title>
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
              >
                Understanding who can donate to whom
              </Text>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <StaggerContainer
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
            staggerDelay={0.05}
          >
            {bloodGroups.map((bg, idx) => (
              <StaggerItem key={idx}>
                <HoverLiftCard liftAmount={-10}>
                  <Card
                    style={{ ...cardStyle, borderTop: `4px solid ${bg.color}` }}
                    className="text-center h-full"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl"
                      style={{ backgroundColor: bg.color }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {bg.type}
                    </motion.div>
                    <div className="text-xs mb-2">
                      <Text strong style={{ color: theme.colors.text }}>
                        Can Give To:
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: "11px",
                        }}
                      >
                        {bg.canGive}
                      </Text>
                    </div>
                    <div className="text-xs">
                      <Text strong style={{ color: theme.colors.text }}>
                        Can Receive:
                      </Text>
                      <br />
                      <Text
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: "11px",
                        }}
                      >
                        {bg.canReceive}
                      </Text>
                    </div>
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ DONATION IMPACT SECTION ============ */}
      <section className={`py-20 ${sectionBgAlt}`}>
        <div className="container mx-auto px-4">
          <Row gutter={[48, 48]} align="middle" className="max-w-6xl mx-auto">
            <Col xs={24} lg={12}>
              <ScrollReveal direction="left">
                <Title
                  level={2}
                  style={{ color: theme.colors.text, marginBottom: 16 }}
                >
                  Your Donation Makes a Real Impact
                </Title>
                <Paragraph
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "16px",
                    marginBottom: 24,
                  }}
                >
                  Every unit of blood you donate can help save multiple lives.
                  Here's how your contribution is distributed:
                </Paragraph>

                <Space direction="vertical" size="middle" className="w-full">
                  {[
                    {
                      label: "Emergency Surgeries",
                      value: 35,
                      color: "#dc2626",
                    },
                    { label: "Cancer Treatment", value: 25, color: "#ea580c" },
                    { label: "Accident Victims", value: 20, color: "#ca8a04" },
                    {
                      label: "Childbirth Complications",
                      value: 15,
                      color: "#16a34a",
                    },
                    {
                      label: "Other Medical Needs",
                      value: 5,
                      color: "#2563eb",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <Text style={{ color: theme.colors.text }}>
                          {item.label}
                        </Text>
                        <Text strong style={{ color: theme.colors.text }}>
                          {item.value}%
                        </Text>
                      </div>
                      <Progress
                        percent={item.value}
                        showInfo={false}
                        strokeColor={item.color}
                        trailColor={theme.colors.border}
                      />
                    </motion.div>
                  ))}
                </Space>
              </ScrollReveal>
            </Col>

            <Col xs={24} lg={12}>
              <ScrollReveal direction="right">
                <GlassCard className="p-8 text-center" blur="lg">
                  <motion.div
                    className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <PulsingHeart size={48} />
                  </motion.div>
                  <Title level={3} style={{ color: theme.colors.text }}>
                    Ready to Save Lives?
                  </Title>
                  <Paragraph style={{ color: theme.colors.textSecondary }}>
                    Join our community of heroes and make a difference today.
                  </Paragraph>
                  <RippleButton
                    onClick={() =>
                      navigate(user ? "/dashboard/add-request" : "/register")
                    }
                    className="bg-red-500 hover:bg-red-600 text-white h-12 px-8 font-semibold rounded-xl mt-4"
                  >
                    {user ? "Create Blood Request" : "Register as Donor"}
                  </RippleButton>
                </GlassCard>
              </ScrollReveal>
            </Col>
          </Row>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Title
                level={2}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                Frequently Asked Questions
              </Title>
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
              >
                Everything you need to know about blood donation
              </Text>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            <Collapse
              accordion
              bordered={false}
              expandIcon={({ isActive }) => (
                <motion.div animate={{ rotate: isActive ? 180 : 0 }}>
                  <QuestionCircleOutlined
                    style={{ color: "#dc2626", fontSize: 18 }}
                  />
                </motion.div>
              )}
              style={{ backgroundColor: "transparent" }}
              items={faqs.map((faq, idx) => ({
                key: idx,
                label: (
                  <Text
                    strong
                    style={{ color: theme.colors.text, fontSize: 16 }}
                  >
                    {faq.q}
                  </Text>
                ),
                children: (
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.a}
                  </Text>
                ),
                style: {
                  marginBottom: 12,
                  backgroundColor: theme.colors.card,
                  borderRadius: 12,
                  border: `1px solid ${theme.colors.border}`,
                  overflow: "hidden",
                },
              }))}
            />
          </div>
        </div>
      </section>

      {/* ============ CONTACT SECTION ============ */}
      <section className={`py-20 ${sectionBgAlt}`}>
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <Title
                level={2}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                Get in Touch
              </Title>
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
              >
                Have questions? We're here to help
              </Text>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <Row gutter={[48, 48]} className="max-w-5xl mx-auto">
            <Col xs={24} lg={12}>
              <ScrollReveal direction="left">
                <Card style={cardStyle} className="border-0 shadow-xl">
                  <Form
                    form={contactForm}
                    layout="vertical"
                    onFinish={onContactFinish}
                    requiredMark={false}
                  >
                    <Form.Item
                      name="name"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          Your Name
                        </Text>
                      }
                      rules={[
                        { required: true, message: "Please enter your name" },
                      ]}
                    >
                      <Input
                        placeholder="Enter your full name"
                        className="h-11 rounded-lg"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          Email Address
                        </Text>
                      }
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Invalid email address" },
                      ]}
                    >
                      <Input
                        placeholder="your@email.com"
                        className="h-11 rounded-lg"
                      />
                    </Form.Item>
                    <Form.Item
                      name="subject"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          Subject
                        </Text>
                      }
                      rules={[
                        { required: true, message: "Please enter a subject" },
                      ]}
                    >
                      <Input
                        placeholder="How can we help?"
                        className="h-11 rounded-lg"
                      />
                    </Form.Item>
                    <Form.Item
                      name="message"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          Message
                        </Text>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please enter your message",
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="Tell us more..."
                        rows={4}
                        className="rounded-lg"
                      />
                    </Form.Item>
                    <RippleButton
                      className="w-full bg-red-500 hover:bg-red-600 text-white h-12 font-semibold rounded-lg flex items-center justify-center gap-2"
                      onClick={() => contactForm.submit()}
                    >
                      <SendOutlined /> Send Message
                    </RippleButton>
                  </Form>
                </Card>
              </ScrollReveal>
            </Col>

            <Col xs={24} lg={12}>
              <ScrollReveal direction="right">
                <Space direction="vertical" size="large" className="w-full">
                  {[
                    {
                      icon: <Phone size={24} />,
                      title: "Emergency Hotline",
                      content: "+880 1521-721946",
                      sub: "Available 24/7",
                    },
                    {
                      icon: <Mail size={24} />,
                      title: "Email Us",
                      content: "contact@bloodbridge.org",
                      sub: "Response within 24 hours",
                    },
                    {
                      icon: <MapPin size={24} />,
                      title: "Head Office",
                      content: "Chittagong, Bangladesh",
                      sub: "Visit us anytime",
                    },
                    {
                      icon: <Globe size={24} />,
                      title: "Coverage Area",
                      content: "All 64 Districts",
                      sub: "Nationwide network",
                    },
                  ].map((info, idx) => (
                    <HoverLiftCard key={idx}>
                      <Card style={cardStyle} className="border-0 shadow-md">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {info.icon}
                          </motion.div>
                          <div>
                            <Text
                              style={{
                                color: theme.colors.textSecondary,
                                fontSize: "12px",
                              }}
                            >
                              {info.title}
                            </Text>
                            <Text
                              strong
                              style={{
                                color: theme.colors.text,
                                display: "block",
                                fontSize: "16px",
                              }}
                            >
                              {info.content}
                            </Text>
                            <Text
                              style={{
                                color: theme.colors.textSecondary,
                                fontSize: "12px",
                              }}
                            >
                              {info.sub}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </HoverLiftCard>
                  ))}
                </Space>
              </ScrollReveal>
            </Col>
          </Row>
        </div>
      </section>

      {/* ============ NEWSLETTER SECTION ============ */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
        <BloodCellParticles count={10} />
        <div className="container mx-auto px-4 relative z-10">
          <Row gutter={[32, 32]} align="middle" className="max-w-4xl mx-auto">
            <Col xs={24} md={14}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Title level={3} style={{ color: "white", marginBottom: 8 }}>
                  Stay Updated
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Subscribe to our newsletter for blood donation drives, health
                  tips, and community updates.
                </Text>
              </motion.div>
            </Col>
            <Col xs={24} md={10}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Space.Compact className="w-full">
                  <Input
                    placeholder="Enter your email"
                    className="h-12 rounded-l-lg"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    onPressEnter={handleNewsletterSubscribe}
                  />
                  <Button
                    type="primary"
                    loading={newsletterLoading}
                    onClick={handleNewsletterSubscribe}
                    className="bg-white text-red-600 border-white h-12 px-6 font-semibold rounded-r-lg hover:bg-red-50"
                  >
                    Subscribe
                  </Button>
                </Space.Compact>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ============ FINAL CTA SECTION ============ */}
      <section
        className={`py-24 ${
          isDarkMode ? "bg-gray-800" : "bg-slate-900"
        } relative overflow-hidden`}
      >
        <GradientMesh />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <FloatingElement duration={3} distance={10}>
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <PulsingHeart size={48} />
              </div>
            </FloatingElement>

            <Title level={2} style={{ color: "white", marginBottom: 16 }}>
              Ready to Make a Difference?
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "18px",
                marginBottom: 32,
              }}
            >
              Your small contribution could be the reason someone celebrates
              another birthday. Join thousands of donors who are saving lives
              every day.
            </Paragraph>

            <Space size="middle" wrap className="justify-center">
              <RippleButton
                onClick={() => navigate("/register")}
                className="bg-red-500 hover:bg-red-600 text-white h-14 px-10 font-bold rounded-xl text-lg flex items-center gap-2"
              >
                <Heart size={20} /> Become a Donor
              </RippleButton>
              <RippleButton
                onClick={() => navigate("/donation-request")}
                className="bg-transparent text-white border-2 border-white/50 hover:bg-white/10 h-14 px-10 font-semibold rounded-xl flex items-center gap-2"
              >
                View Requests <ArrowRight size={18} />
              </RippleButton>
            </Space>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
