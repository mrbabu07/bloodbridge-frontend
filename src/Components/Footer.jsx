import React from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Divider,
  Input,
} from "antd";
import {
  HeartFilled,
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinFilled,
  YoutubeFilled,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SendOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useTheme } from "../Context/ThemeContext";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? "#0f172a" : "#1e293b";

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Blood Requests", path: "/donation-request" },
    { label: "Find Donors", path: "/search" },
    { label: "Statistics", path: "/statistics" },
  ];

  const supportLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  const donorLinks = [
    { label: "Register as Donor", path: "/register" },
    { label: "Eligibility Criteria", path: "/faq" },
    { label: "Donation Process", path: "/faq" },
    { label: "Health Benefits", path: "/faq" },
  ];

  return (
    <AntFooter style={{ background: bgColor, color: "#fff", padding: 0 }}>
      {/* Main Footer */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[48, 48]}>
            {/* Brand Section */}
            <Col xs={24} md={8} lg={6}>
              <Space direction="vertical" size="middle">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <HeartFilled style={{ fontSize: "24px", color: "white" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ color: "#fff", margin: 0 }}>
                      BloodBridge
                    </Title>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      Save Lives Together
                    </Text>
                  </div>
                </div>
                <Paragraph
                  style={{
                    color: "rgba(255, 255, 255, 0.65)",
                    marginBottom: 0,
                  }}
                >
                  Connecting blood donors with those in need across Bangladesh.
                  Every drop counts in saving precious lives.
                </Paragraph>
                <Space size="small">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<FacebookFilled />}
                    style={{ color: "#fff" }}
                    href="https://facebook.com"
                    target="_blank"
                  />
                  <Button
                    type="text"
                    shape="circle"
                    icon={<TwitterOutlined />}
                    style={{ color: "#fff" }}
                    href="https://twitter.com"
                    target="_blank"
                  />
                  <Button
                    type="text"
                    shape="circle"
                    icon={<InstagramOutlined />}
                    style={{ color: "#fff" }}
                    href="https://instagram.com"
                    target="_blank"
                  />
                  <Button
                    type="text"
                    shape="circle"
                    icon={<LinkedinFilled />}
                    style={{ color: "#fff" }}
                    href="https://linkedin.com"
                    target="_blank"
                  />
                  <Button
                    type="text"
                    shape="circle"
                    icon={<YoutubeFilled />}
                    style={{ color: "#fff" }}
                    href="https://youtube.com"
                    target="_blank"
                  />
                </Space>
              </Space>
            </Col>

            {/* Quick Links */}
            <Col xs={12} md={8} lg={4}>
              <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
                Quick Links
              </Title>
              <Space direction="vertical" size="small">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RightOutlined style={{ fontSize: 10 }} />
                    {link.label}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* Support */}
            <Col xs={12} md={8} lg={4}>
              <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
                Support
              </Title>
              <Space direction="vertical" size="small">
                {supportLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RightOutlined style={{ fontSize: 10 }} />
                    {link.label}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* For Donors */}
            <Col xs={12} md={8} lg={4}>
              <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
                For Donors
              </Title>
              <Space direction="vertical" size="small">
                {donorLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RightOutlined style={{ fontSize: 10 }} />
                    {link.label}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* Contact & Newsletter */}
            <Col xs={24} md={16} lg={6}>
              <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
                Contact Us
              </Title>
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-start gap-3">
                  <PhoneOutlined style={{ color: "#dc2626", marginTop: 4 }} />
                  <div>
                    <Text style={{ color: "#fff", display: "block" }}>
                      +880 1521-721946
                    </Text>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      24/7 Emergency
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailOutlined style={{ color: "#dc2626", marginTop: 4 }} />
                  <div>
                    <Text style={{ color: "#fff", display: "block" }}>
                      contact@bloodbridge.org
                    </Text>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      Email Support
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined
                    style={{ color: "#dc2626", marginTop: 4 }}
                  />
                  <div>
                    <Text style={{ color: "#fff", display: "block" }}>
                      Chittagong, Bangladesh
                    </Text>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      Head Office
                    </Text>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="mt-4">
                  <Text
                    style={{ color: "#fff", display: "block", marginBottom: 8 }}
                  >
                    Subscribe to Newsletter
                  </Text>
                  <Space.Compact className="w-full">
                    <Input placeholder="Your email" className="rounded-l-lg" />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      className="bg-red-500 border-red-500 rounded-r-lg"
                    />
                  </Space.Compact>
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "16px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Text style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                © {new Date().getFullYear()} BloodBridge. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12} className="text-left md:text-right">
              <Space
                split={
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                }
              >
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  FAQ
                </Link>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
