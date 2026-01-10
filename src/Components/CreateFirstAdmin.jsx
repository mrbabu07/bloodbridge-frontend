import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Space, Alert } from "antd";
import {
  CrownOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const CreateFirstAdmin = ({ onAdminCreated }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.post(
        `${apiBase}/create-first-admin`,
        values
      );

      if (response.data.success) {
        toast.success("First admin user created successfully! 🎉");
        form.resetFields();
        if (onAdminCreated) {
          onAdminCreated();
        }
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create admin user";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <CrownOutlined
                  className="text-white"
                  style={{ fontSize: "32px" }}
                />
              </div>
            </div>
            <Title level={2} style={{ color: "white", margin: 0 }}>
              Create First Admin
            </Title>
            <Text style={{ color: "#fee2e2" }}>
              Set up the initial administrator account
            </Text>
          </div>

          {/* Form */}
          <div className="p-8">
            <Alert
              message="Important"
              description="This will create the first admin user for the system. Only one admin can be created this way."
              type="info"
              showIcon
              className="mb-6"
            />

            <Form
              form={form}
              name="createFirstAdmin"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please input admin name!" },
                  { min: 2, message: "Name must be at least 2 characters!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Administrator Name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please input admin email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="admin@bloodbridge.org"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Strong password (min. 6 characters)"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm password"
                />
              </Form.Item>

              <Form.Item className="mt-8">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="bg-red-600 hover:bg-red-700 h-12 text-lg font-bold"
                  icon={<CrownOutlined />}
                >
                  Create Admin Account
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-6 text-center">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                This admin will have full access to manage users, roles, and
                system settings.
              </Text>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateFirstAdmin;
