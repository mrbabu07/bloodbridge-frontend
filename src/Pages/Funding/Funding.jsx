import React, { useContext, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeContext";
import { motion } from "framer-motion";
import {
  Card,
  Form,
  InputNumber,
  Button,
  Typography,
  Space,
  Avatar,
  Divider,
} from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  LockOutlined,
  HeartFilled,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Heart, Shield, Zap, Gift, CreditCard, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import {
  BloodCellParticles,
  GradientMesh,
  HoverLiftCard,
  RippleButton,
  AnimatedCounter,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;

const Funding = () => {
  const axiosPublic = useAxios();
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedAmount, setSelectedAmount] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = {
      donorEmail: user?.email,
      donateAmount: values.donateAmount,
      donorName: user?.name,
    };

    try {
      const res = await axiosPublic.post("/create-payment-checkout", formData);
      const { url } = res.data;
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (amount) => {
    setSelectedAmount(amount);
    form.setFieldsValue({ donateAmount: amount });
  };

  const quickAmounts = [
    { amount: 100, label: "৳100", icon: "☕", desc: "Buy us a coffee" },
    { amount: 500, label: "৳500", icon: "🩸", desc: "Support a drive" },
    { amount: 1000, label: "৳1,000", icon: "💉", desc: "Medical supplies" },
    { amount: 5000, label: "৳5,000", icon: "🏥", desc: "Major support" },
  ];

  const benefits = [
    { icon: <Heart size={16} />, text: "Save lives directly" },
    { icon: <Shield size={16} />, text: "100% secure payment" },
    { icon: <Zap size={16} />, text: "Instant processing" },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-pink-50"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GradientMesh />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              isDarkMode ? "text-red-900" : "text-red-200"
            } opacity-20`}
            initial={{ y: -100, x: `${i * 15}%` }}
            animate={{ y: "110vh", rotate: 360 }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          >
            <Heart size={30 + i * 8} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full relative z-10"
      >
        <HoverLiftCard liftAmount={-8}>
          <Card
            className="shadow-2xl rounded-3xl overflow-hidden border-0"
            style={{ backgroundColor: theme.colors.card }}
            cover={
              <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-pink-700 p-8 text-center overflow-hidden">
                <BloodCellParticles count={10} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="relative z-10"
                >
                  <motion.div
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Gift size={40} className="text-white" />
                  </motion.div>
                </motion.div>
                <Title
                  level={2}
                  style={{ color: "#fff", margin: 0 }}
                  className="relative z-10"
                >
                  Make a Donation
                </Title>
                <Text style={{ color: "#fee2e2" }} className="relative z-10">
                  Every contribution saves lives
                </Text>

                {/* Benefits badges */}
                <div className="flex justify-center gap-2 mt-4 relative z-10">
                  {benefits.map((b, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs"
                    >
                      {b.icon}
                      <span>{b.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            }
          >
            <div className="p-4">
              {/* User Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl p-4 mb-6 flex items-center gap-4"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(239, 68, 68, 0.1)"
                    : "#fef2f2",
                  border: `1px solid ${
                    isDarkMode ? "rgba(239, 68, 68, 0.2)" : "#fecaca"
                  }`,
                }}
              >
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Avatar
                    size={54}
                    src={user?.photoURL}
                    icon={<UserOutlined />}
                    className="bg-gradient-to-br from-red-500 to-pink-600"
                  />
                </motion.div>
                <div>
                  <Text
                    strong
                    style={{ fontSize: "16px", color: theme.colors.text }}
                    className="block"
                  >
                    {user?.name || "Guest Donor"}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary }}>
                    {user?.email || "No email provided"}
                  </Text>
                </div>
                <CheckCircleOutlined className="ml-auto text-green-500 text-xl" />
              </motion.div>

              {/* Quick Amount Selection */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <Text
                  strong
                  style={{ color: theme.colors.text }}
                  className="block mb-3"
                >
                  <Sparkles size={16} className="inline mr-2 text-yellow-500" />
                  Quick Select Amount
                </Text>
                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map((item, idx) => (
                    <motion.button
                      key={item.amount}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickAmount(item.amount)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedAmount === item.amount
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : `border-gray-200 dark:border-gray-700 hover:border-red-300`
                      }`}
                      style={{
                        backgroundColor:
                          selectedAmount === item.amount
                            ? isDarkMode
                              ? "rgba(239, 68, 68, 0.1)"
                              : "#fef2f2"
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <span
                          className="font-bold text-lg"
                          style={{ color: theme.colors.text }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <Text
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: "12px",
                        }}
                      >
                        {item.desc}
                      </Text>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Form.Item
                  name="donateAmount"
                  label={
                    <Text strong style={{ color: theme.colors.text }}>
                      Or Enter Custom Amount (BDT)
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please enter donation amount" },
                  ]}
                >
                  <InputNumber
                    prefix="৳"
                    placeholder="Enter amount"
                    className="w-full h-12 rounded-xl"
                    min={1}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={() => setSelectedAmount(null)}
                  />
                </Form.Item>

                <Form.Item className="mb-4">
                  <RippleButton
                    onClick={() => form.submit()}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Heart size={20} />
                      </motion.div>
                    ) : (
                      <>
                        <HeartFilled /> Proceed to Payment
                      </>
                    )}
                  </RippleButton>
                </Form.Item>
              </Form>

              <Divider style={{ borderColor: theme.colors.border }} />

              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-green-500">
                    <SafetyCertificateOutlined />
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: "12px",
                      }}
                    >
                      SSL Secured
                    </Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard size={14} className="text-blue-500" />
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: "12px",
                      }}
                    >
                      Stripe Powered
                    </Text>
                  </div>
                </div>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "12px",
                  }}
                >
                  Your donation helps save lives and support communities across
                  Bangladesh.
                </Text>
              </motion.div>
            </div>
          </Card>
        </HoverLiftCard>
      </motion.div>
    </div>
  );
};

export default Funding;
