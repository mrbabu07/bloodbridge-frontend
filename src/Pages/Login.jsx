import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";
import { Form, Input, Button, Divider, Space, Checkbox } from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
  UserOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, loading } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setIsLoading(true);
    const { email, password } = values;

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success("Logged in successfully! 🎉");
        navigate("/");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login credentials
  const demoCredentials = {
    admin: { email: "admin@bloodbridge.org", password: "admin123" },
    donor: { email: "donor@bloodbridge.org", password: "donor123" },
    volunteer: { email: "volunteer@bloodbridge.org", password: "volunteer123" },
  };

  const handleDemoLogin = async (role) => {
    const creds = demoCredentials[role];
    form.setFieldsValue(creds);
    setIsLoading(true);

    try {
      const result = await login(creds.email, creds.password);

      if (result.success) {
        toast.success(`Logged in as demo ${role}! 🎉`);
        navigate("/dashboard");
      } else {
        // If login fails, user might not exist - show message to seed
        toast.error(`Demo ${role} not found. Please seed demo users first.`);
      }
    } catch (error) {
      toast.error(`Demo login failed. Please ensure demo users are seeded.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-red-50 to-red-100"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Heart size={48} className="text-red-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-red-100"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              isDarkMode ? "text-red-900" : "text-red-200"
            } opacity-20`}
            initial={{ y: -100, x: `${i * 25}%` }}
            animate={{ y: "110vh", rotate: 360 }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i,
            }}
          >
            <Heart size={40 + i * 10} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <div
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} fill="white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-red-100">Sign in to continue saving lives</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Demo Login Buttons */}
            <div className="mb-6">
              <p
                className="text-center text-sm mb-3"
                style={{ color: theme.colors.textSecondary }}
              >
                <ThunderboltOutlined className="mr-1" /> Quick Demo Login
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="small"
                  onClick={() => handleDemoLogin("admin")}
                  className="text-xs"
                  icon={<UserOutlined />}
                  loading={isLoading}
                  style={{
                    backgroundColor: "#ef4444",
                    borderColor: "#ef4444",
                    color: "white",
                  }}
                >
                  Admin
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDemoLogin("donor")}
                  className="text-xs"
                  icon={<UserOutlined />}
                  loading={isLoading}
                  style={{
                    backgroundColor: "#22c55e",
                    borderColor: "#22c55e",
                    color: "white",
                  }}
                >
                  Donor
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDemoLogin("volunteer")}
                  className="text-xs"
                  icon={<UserOutlined />}
                  loading={isLoading}
                  style={{
                    backgroundColor: "#3b82f6",
                    borderColor: "#3b82f6",
                    color: "white",
                  }}
                >
                  Volunteer
                </Button>
              </div>
            </div>

            <Divider style={{ borderColor: theme.colors.border }}>
              <span style={{ color: theme.colors.textSecondary }}>
                or sign in with email
              </span>
            </Divider>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={
                    <MailOutlined
                      style={{ color: theme.colors.textSecondary }}
                    />
                  }
                  placeholder="Email Address"
                  className="rounded-lg h-11"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined
                      style={{ color: theme.colors.textSecondary }}
                    />
                  }
                  placeholder="Password"
                  className="rounded-lg h-11"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-4">
                <Checkbox>
                  <span style={{ color: theme.colors.textSecondary }}>
                    Remember me
                  </span>
                </Checkbox>
                <Link
                  to="/forgot-password"
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <Form.Item className="mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  className="bg-red-500 border-red-500 h-12 font-semibold rounded-lg"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            {/* Social Login */}
            <Divider style={{ borderColor: theme.colors.border }}>
              <span style={{ color: theme.colors.textSecondary }}>
                or continue with
              </span>
            </Divider>

            <Space className="w-full" direction="vertical" size="small">
              <Button
                block
                size="large"
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin("Google")}
                className="rounded-lg h-11"
              >
                Continue with Google
              </Button>
              <Button
                block
                size="large"
                icon={<FacebookFilled style={{ color: "#1877f2" }} />}
                onClick={() => handleSocialLogin("Facebook")}
                className="rounded-lg h-11"
              >
                Continue with Facebook
              </Button>
            </Space>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <span style={{ color: theme.colors.textSecondary }}>
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
