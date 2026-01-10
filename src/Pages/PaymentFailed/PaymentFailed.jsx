import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import { Button, Typography, Card, Space } from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { ScrollReveal } from "../../Components/Animations";

const { Text, Title, Paragraph } = Typography;

const PaymentFailed = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-pink-50"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-red-500/20 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-10%", right: "-10%" }}
        />
      </div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <ScrollReveal>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={`max-w-xl w-full shadow-2xl rounded-3xl border-0 ${
                isDarkMode ? "bg-gray-800" : ""
              }`}
            >
              {/* Error Icon */}
              <div className="flex justify-center pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="relative"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CloseCircleFilled className="text-5xl text-red-500" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-red-500"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              <div className="text-center px-8 py-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Title level={2} className={isDarkMode ? "text-white" : ""}>
                    Payment Failed
                  </Title>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Text type="secondary" className="text-lg block mb-2">
                    We couldn't process your donation at this time.
                  </Text>
                  <Text type="secondary">
                    Don't worry — your account hasn't been charged.
                  </Text>
                </motion.div>

                {/* Reasons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`mt-6 p-6 rounded-2xl ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-red-50 border-red-100"
                  } border`}
                >
                  <Paragraph
                    strong
                    className={isDarkMode ? "text-gray-300" : "text-red-700"}
                  >
                    Possible Reasons
                  </Paragraph>
                  <ul
                    className={`text-left text-sm space-y-2 max-w-xs mx-auto ${
                      isDarkMode ? "text-gray-400" : "text-red-600"
                    }`}
                  >
                    <li>• Insufficient funds</li>
                    <li>• Card expired or declined</li>
                    <li>• Network connection issue</li>
                    <li>• Authentication failed</li>
                  </ul>
                  <div
                    className={`h-px ${
                      isDarkMode ? "bg-gray-600" : "bg-red-200"
                    } w-full my-4`}
                  />
                  <Paragraph
                    className={`mb-0 italic ${
                      isDarkMode ? "text-gray-400" : "text-red-500"
                    }`}
                  >
                    "Your willingness to help is what matters most."
                  </Paragraph>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 space-y-4"
                >
                  <Link to="/funding" className="block">
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<ReloadOutlined />}
                      className="h-12 text-lg font-bold rounded-xl bg-red-600 hover:bg-red-700 border-0"
                    >
                      Try Again
                    </Button>
                  </Link>
                  <Space size="middle" className="w-full justify-center">
                    <Link to="/donation-request">
                      <Button
                        size="large"
                        icon={<UnorderedListOutlined />}
                        className="rounded-xl"
                      >
                        View Requests
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button
                        size="large"
                        icon={<HomeOutlined />}
                        className="rounded-xl"
                      >
                        Back to Home
                      </Button>
                    </Link>
                  </Space>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PaymentFailed;
