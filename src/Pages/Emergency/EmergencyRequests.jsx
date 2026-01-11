import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import { AuthContext } from "../../Context/AuthProvider";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Card,
  Button,
  Empty,
  Pagination,
  Space,
  Typography,
  Tag,
  Badge,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  WarningOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HeartFilled,
  ThunderboltFilled,
  SendOutlined,
} from "@ant-design/icons";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  GradientMesh,
  RippleButton,
  PulsingHeart,
} from "../../Components/Animations";
import SkeletonCard from "../../Components/Loading/SkeletonCard";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EmergencyRequests = () => {
  const { isDarkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
  });

  useEffect(() => {
    if (user) {
      axiosSecure.get(`/users/role/${user.email}`).then((res) => {
        setIsAdmin(res.data.role === "admin");
      });
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [pagination.page]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosPublic.get(
        `/requests/emergency?page=${pagination.page}&limit=${pagination.limit}`
      );
      setRequests(res.data.requests);
      setPagination((prev) => ({ ...prev, total: res.data.total }));
    } catch (error) {
      console.error("Fetch emergency requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (values) => {
    try {
      await axiosSecure.post("/emergency-broadcast", values);
      toast.success("Emergency broadcast sent successfully!");
      setIsBroadcastModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Broadcast error:", error);
      toast.error(error.response?.data?.error || "Failed to send broadcast");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      default:
        return "yellow";
    }
  };

  const getPriorityIcon = (priority) => {
    return priority === "critical" ? (
      <ThunderboltFilled className="animate-pulse" />
    ) : (
      <WarningOutlined />
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-orange-50"
      }`}
    >
      {/* Hero Section with Alert Animation */}
      <div className="relative overflow-hidden py-16">
        <GradientMesh />

        {/* Pulsing Alert Background */}
        <motion.div
          className="absolute inset-0 bg-red-500/10"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <motion.div
                className="flex justify-center mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Badge count="URGENT" className="text-2xl">
                  <WarningOutlined className="text-6xl text-red-600" />
                </Badge>
              </motion.div>
              <Title level={1} className={isDarkMode ? "text-white" : ""}>
                🚨 Emergency Blood Requests
              </Title>
              <Text type="secondary" className="text-lg">
                Critical blood needs - Immediate response required
              </Text>
            </div>
          </ScrollReveal>

          {isAdmin && (
            <ScrollReveal delay={0.2}>
              <div className="flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  danger
                  icon={<SendOutlined />}
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Send Emergency Broadcast
                </Button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Emergency Requests Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(9)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <Card className={isDarkMode ? "bg-gray-800" : ""}>
            <Empty description="No emergency requests at the moment" />
          </Card>
        ) : (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {requests.map((request) => (
                <StaggerItem key={request._id}>
                  <HoverLiftCard>
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0.4)",
                          "0 0 0 10px rgba(239, 68, 68, 0)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Card
                        className={`h-full border-2 border-red-500 ${
                          isDarkMode ? "bg-gray-800" : ""
                        }`}
                      >
                        {/* Priority Badge */}
                        <div className="absolute top-4 right-4">
                          <Tag
                            color={getPriorityColor(request.priority)}
                            icon={getPriorityIcon(request.priority)}
                            className="text-sm font-bold uppercase animate-pulse"
                          >
                            {request.priority || "high"}
                          </Tag>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                              <Text className="text-white text-2xl font-bold">
                                {request.blood_group}
                              </Text>
                            </div>
                            <div>
                              <Title
                                level={5}
                                className={`mb-0 ${
                                  isDarkMode ? "text-white" : ""
                                }`}
                              >
                                {request.recipientName}
                              </Title>
                              <Text type="secondary" className="text-sm">
                                Needs {request.blood_group} Blood
                              </Text>
                            </div>
                          </div>

                          <Paragraph
                            type="secondary"
                            ellipsis={{ rows: 2 }}
                            className="mb-3"
                          >
                            {request.request_message}
                          </Paragraph>

                          <Space
                            direction="vertical"
                            size="small"
                            className="w-full"
                          >
                            <div className="flex items-center gap-2">
                              <EnvironmentOutlined className="text-red-600" />
                              <Text>
                                {request.district}
                                {request.upazila && `, ${request.upazila}`}
                              </Text>
                            </div>

                            {request.hospital && (
                              <div className="flex items-center gap-2">
                                <Text type="secondary" className="text-sm">
                                  🏥 {request.hospital}
                                </Text>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <CalendarOutlined className="text-red-600" />
                              <Text>{request.donation_date}</Text>
                            </div>

                            <div className="flex items-center gap-2">
                              <ClockCircleOutlined className="text-red-600" />
                              <Text>{request.donation_time}</Text>
                            </div>
                          </Space>
                        </div>

                        <RippleButton
                          onClick={() =>
                            navigate(`/donation-request/${request._id}`)
                          }
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold"
                        >
                          <HeartFilled className="mr-2" />
                          Respond Now
                        </RippleButton>
                      </Card>
                    </motion.div>
                  </HoverLiftCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>

      {/* Emergency Broadcast Modal */}
      <Modal
        title={
          <Space>
            <SendOutlined className="text-red-600" />
            <span>Send Emergency Broadcast</span>
          </Space>
        }
        open={isBroadcastModalOpen}
        onCancel={() => {
          setIsBroadcastModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleBroadcast}>
          <Form.Item
            name="bloodGroup"
            label="Blood Group"
            rules={[{ required: true, message: "Please select blood group" }]}
          >
            <Select placeholder="Select Blood Group" size="large">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <Option key={bg} value={bg}>
                  {bg}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="district" label="District (Optional)">
            <Input placeholder="Leave empty to broadcast to all districts" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            initialValue="🚨 Emergency Blood Alert"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: "Please enter message" }]}
          >
            <TextArea
              rows={4}
              placeholder="Urgent: We need your help! Critical blood shortage..."
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setIsBroadcastModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                danger
                className="bg-red-600"
              >
                Send Broadcast
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmergencyRequests;
