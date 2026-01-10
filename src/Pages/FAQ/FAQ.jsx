import React from "react";
import { Typography, Collapse, Card, Row, Col, Input, Space } from "antd";
import { motion } from "framer-motion";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useTheme } from "../../Context/ThemeContext";
import {
  HelpCircle,
  Heart,
  Clock,
  Shield,
  Users,
  Droplet,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  BloodCellParticles,
  GradientMesh,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;

const FAQ = () => {
  const { isDarkMode, theme } = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const faqCategories = [
    {
      title: "Eligibility",
      icon: <Users size={24} />,
      faqs: [
        {
          q: "Who can donate blood?",
          a: "Anyone between 18-65 years old, weighing at least 50kg, and in good health can donate blood. You should not have donated blood in the last 3 months.",
        },
        {
          q: "Can I donate if I have a tattoo?",
          a: "Yes, you can donate blood 6 months after getting a tattoo, provided it was done at a licensed facility with sterile equipment.",
        },
        {
          q: "Can I donate during pregnancy?",
          a: "No, pregnant women should not donate blood. You can resume donation 6 months after delivery.",
        },
        {
          q: "Can diabetics donate blood?",
          a: "Diabetics on insulin cannot donate. Those managing diabetes with diet or oral medication may be eligible after medical evaluation.",
        },
      ],
    },
    {
      title: "Donation Process",
      icon: <Droplet size={24} />,
      faqs: [
        {
          q: "How long does the donation process take?",
          a: "The entire process takes about 30-45 minutes, including registration, health screening, donation (8-10 minutes), and refreshments.",
        },
        {
          q: "How much blood is taken during donation?",
          a: "A standard whole blood donation is approximately 450ml (about one pint), which is less than 10% of your total blood volume.",
        },
        {
          q: "Does blood donation hurt?",
          a: "You may feel a brief pinch when the needle is inserted, but the actual donation is painless. Most donors describe it as a mild discomfort.",
        },
        {
          q: "What should I do before donating?",
          a: "Eat a healthy meal, drink plenty of water, get adequate sleep, and avoid alcohol 24 hours before donation.",
        },
      ],
    },
    {
      title: "After Donation",
      icon: <Activity size={24} />,
      faqs: [
        {
          q: "How long does it take to recover?",
          a: "Your body replaces the fluid lost within 24 hours. Red blood cells are replaced within 4-6 weeks. Most people feel fine immediately after donation.",
        },
        {
          q: "What should I do after donating?",
          a: "Rest for 10-15 minutes, have refreshments provided, drink extra fluids for 24-48 hours, and avoid strenuous activity for the rest of the day.",
        },
        {
          q: "Can I exercise after donating?",
          a: "Avoid heavy exercise or lifting for 24 hours. Light activities like walking are fine after a few hours of rest.",
        },
        {
          q: "How often can I donate blood?",
          a: "You can donate whole blood every 3 months (90 days). Platelet donors can donate more frequently, up to 24 times per year.",
        },
      ],
    },
    {
      title: "Safety & Health",
      icon: <Shield size={24} />,
      faqs: [
        {
          q: "Is blood donation safe?",
          a: "Yes, blood donation is completely safe. We use sterile, single-use equipment for each donor. There is no risk of contracting any disease from donating.",
        },
        {
          q: "Are there any side effects?",
          a: "Some donors may experience mild dizziness, lightheadedness, or bruising at the needle site. These are temporary and resolve quickly.",
        },
        {
          q: "What blood tests are performed?",
          a: "All donated blood is tested for HIV, Hepatitis B & C, Syphilis, and other infectious diseases to ensure safety for recipients.",
        },
        {
          q: "What are the health benefits of donating?",
          a: "Regular donation can reduce iron overload, improve cardiovascular health, and provide a free mini health check-up including blood pressure and hemoglobin levels.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-20 overflow-hidden">
        <GradientMesh />
        <BloodCellParticles count={12} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Title level={1} style={{ color: "white", marginBottom: 16 }}>
              Frequently Asked Questions
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "18px",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Find answers to common questions about blood donation
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className={`py-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Input
              size="large"
              placeholder="Search questions..."
              prefix={
                <SearchOutlined style={{ color: theme.colors.textSecondary }} />
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {(searchTerm ? filteredCategories : faqCategories).map(
              (category, catIdx) => (
                <ScrollReveal key={catIdx} delay={catIdx * 0.1}>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {category.icon}
                      </motion.div>
                      <Title
                        level={4}
                        style={{ color: theme.colors.text, margin: 0 }}
                      >
                        {category.title}
                      </Title>
                    </div>

                    <Collapse
                      accordion
                      bordered={false}
                      expandIcon={({ isActive }) => (
                        <HelpCircle
                          size={18}
                          className={`transition-transform ${
                            isActive
                              ? "rotate-180 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                      style={{ backgroundColor: "transparent" }}
                      items={category.faqs.map((faq, idx) => ({
                        key: idx,
                        label: (
                          <Text strong style={{ color: theme.colors.text }}>
                            {faq.q}
                          </Text>
                        ),
                        children: (
                          <Text style={{ color: theme.colors.textSecondary }}>
                            {faq.a}
                          </Text>
                        ),
                        style: {
                          marginBottom: 8,
                          backgroundColor: theme.colors.card,
                          borderRadius: 12,
                          border: `1px solid ${theme.colors.border}`,
                          overflow: "hidden",
                        },
                      }))}
                    />
                  </div>
                </ScrollReveal>
              )
            )}

            {searchTerm && filteredCategories.length === 0 && (
              <ScrollReveal>
                <HoverLiftCard>
                  <Card style={cardStyle} className="text-center py-8">
                    <AlertCircle
                      size={48}
                      className="text-gray-400 mx-auto mb-4"
                    />
                    <Title level={4} style={{ color: theme.colors.text }}>
                      No results found
                    </Title>
                    <Text style={{ color: theme.colors.textSecondary }}>
                      Try different keywords or browse all categories
                    </Text>
                  </Card>
                </HoverLiftCard>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className={`py-16 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <HoverLiftCard>
              <Card
                style={cardStyle}
                className="max-w-2xl mx-auto border-0 shadow-lg"
              >
                <motion.div whileHover={{ scale: 1.1 }}>
                  <HelpCircle size={48} className="text-red-500 mx-auto mb-4" />
                </motion.div>
                <Title level={3} style={{ color: theme.colors.text }}>
                  Still Have Questions?
                </Title>
                <Paragraph
                  style={{
                    color: theme.colors.textSecondary,
                    marginBottom: 24,
                  }}
                >
                  Can't find what you're looking for? Our support team is here
                  to help.
                </Paragraph>
                <Space>
                  <a href="/contact">
                    <motion.button
                      className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Us
                    </motion.button>
                  </a>
                  <a href="tel:+8801521721946">
                    <motion.button
                      className="border border-red-500 text-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Call Hotline
                    </motion.button>
                  </a>
                </Space>
              </Card>
            </HoverLiftCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
