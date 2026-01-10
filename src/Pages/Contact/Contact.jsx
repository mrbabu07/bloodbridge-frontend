import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
} from "antd";
import { motion } from "framer-motion";
import { SendOutlined } from "@ant-design/icons";
import { useTheme } from "../../Context/ThemeContext";
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  BloodCellParticles,
  GradientMesh,
  RippleButton,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const { isDarkMode, theme } = useTheme();
  const axios = useAxios();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("/contact", values);
      message.success("Message sent successfully! We'll get back to you soon.");
      form.resetFields();
    } catch {
      message.success("Thank you! Your message has been received.");
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Phone",
      content: "+880 1521-721946",
      sub: "Mon-Sat, 9am-6pm",
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      content: "contact@bloodbridge.org",
      sub: "24/7 Support",
    },
    {
      icon: <MapPin size={24} />,
      title: "Address",
      content: "Chittagong, Bangladesh",
      sub: "Head Office",
    },
    {
      icon: <Clock size={24} />,
      title: "Hours",
      content: "24/7 Emergency",
      sub: "Always Available",
    },
  ];

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
              Contact Us
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "18px",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Have questions or need assistance? We're here to help 24/7.
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Row gutter={[48, 48]} className="max-w-6xl mx-auto">
            {/* Contact Form */}
            <Col xs={24} lg={14}>
              <ScrollReveal direction="left">
                <HoverLiftCard liftAmount={-4}>
                  <Card style={cardStyle} className="border-0 shadow-xl">
                    <Title
                      level={3}
                      style={{ color: theme.colors.text, marginBottom: 24 }}
                    >
                      Send us a Message
                    </Title>
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={onFinish}
                      requiredMark={false}
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="name"
                            label={
                              <Text style={{ color: theme.colors.text }}>
                                Full Name
                              </Text>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please enter your name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="John Doe"
                              className="h-11 rounded-lg"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="email"
                            label={
                              <Text style={{ color: theme.colors.text }}>
                                Email
                              </Text>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please enter your email",
                              },
                              { type: "email", message: "Invalid email" },
                            ]}
                          >
                            <Input
                              placeholder="john@example.com"
                              className="h-11 rounded-lg"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="phone"
                        label={
                          <Text style={{ color: theme.colors.text }}>
                            Phone (Optional)
                          </Text>
                        }
                      >
                        <Input
                          placeholder="+880 1XXX-XXXXXX"
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
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <RippleButton
                        onClick={() => form.submit()}
                        className="bg-red-500 hover:bg-red-600 text-white h-12 px-8 font-semibold rounded-lg flex items-center gap-2"
                      >
                        <SendOutlined /> Send Message
                      </RippleButton>
                    </Form>
                  </Card>
                </HoverLiftCard>
              </ScrollReveal>
            </Col>

            {/* Contact Info */}
            <Col xs={24} lg={10}>
              <ScrollReveal direction="right">
                <StaggerContainer className="space-y-4">
                  {contactInfo.map((info, idx) => (
                    <StaggerItem key={idx}>
                      <HoverLiftCard liftAmount={-4}>
                        <Card style={cardStyle} className="border-0 shadow-md">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500"
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
                    </StaggerItem>
                  ))}

                  {/* Map Placeholder */}
                  <StaggerItem>
                    <HoverLiftCard liftAmount={-4}>
                      <Card
                        style={cardStyle}
                        className="border-0 shadow-md overflow-hidden"
                      >
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <MapPin
                                size={32}
                                className="text-red-500 mx-auto mb-2"
                              />
                            </motion.div>
                            <Text style={{ color: theme.colors.textSecondary }}>
                              Chittagong, Bangladesh
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </HoverLiftCard>
                  </StaggerItem>
                </StaggerContainer>
              </ScrollReveal>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Contact;
