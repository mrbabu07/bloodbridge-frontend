import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useTheme } from "../../Context/ThemeContext";
import { Button, Typography, Card, Space } from "antd";
import {
  HomeOutlined,
  FundOutlined,
  HeartFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "../../Components/Animations";

const { Text, Title, Paragraph } = Typography;

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const axiosPublic = useAxios();
  const { isDarkMode } = useTheme();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (session_id) {
      axiosPublic
        .post(`/payment-success?session_id=${session_id}`)
        .then((res) => console.log("Payment success recorded:", res.data))
        .catch((err) => console.error("Error recording payment success:", err));
    }
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [axiosPublic, session_id]);

  const confettiColors = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ec4899",
  ];
  const confettiParticles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-emerald-50 via-white to-green-50"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-10%" }}
        />
      </div>

      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-3 h-3 rounded-sm"
                style={{ left: `${p.x}%`, backgroundColor: p.color }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{ y: "100vh", opacity: [1, 1, 0], rotate: 360 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

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
              <div className="flex justify-center pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="relative"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircleFilled className="text-5xl text-emerald-500" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-emerald-500"
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
                    Payment Successful!
                  </Title>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Text type="secondary" className="text-lg block mb-2">
                    Thank you for your incredible generosity!
                  </Text>
                  <Text type="secondary">
                    Your donation helps save lives and support our mission.
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`mt-6 p-6 rounded-2xl ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-emerald-50 border-emerald-100"
                  } border`}
                >
                  <Paragraph
                    strong
                    className={
                      isDarkMode ? "text-gray-300" : "text-emerald-700"
                    }
                  >
                    Transaction Details
                  </Paragraph>
                  <Text code className="text-emerald-600 font-mono text-sm">
                    ID: {session_id || "N/A"}
                  </Text>
                  <div
                    className={`h-px ${
                      isDarkMode ? "bg-gray-600" : "bg-emerald-200"
                    } w-full my-4`}
                  />
                  <Paragraph
                    className={`mb-0 italic ${
                      isDarkMode ? "text-gray-400" : "text-emerald-600"
                    }`}
                  >
                    "Alone we can do so little; together we can do so much."
                  </Paragraph>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 space-y-4"
                >
                  <Link to="/" className="block">
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<HomeOutlined />}
                      className="h-12 text-lg font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 border-0"
                    >
                      Back to Home
                    </Button>
                  </Link>
                  <Space size="middle" className="w-full justify-center">
                    <Link to="/funding">
                      <Button
                        size="large"
                        icon={<FundOutlined />}
                        className="rounded-xl"
                      >
                        View Contributions
                      </Button>
                    </Link>
                    <Link to="/funding">
                      <Button
                        size="large"
                        icon={<HeartFilled />}
                        className="rounded-xl"
                      >
                        Donate Again
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
}

export default PaymentSuccess;
