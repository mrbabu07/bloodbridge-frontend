import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeContext";
import toast from "react-hot-toast";
import {
  Card,
  Descriptions,
  Badge,
  Button,
  Modal,
  Typography,
  Space,
  Divider,
  Spin,
  Result,
} from "antd";
import {
  HeartFilled,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  BankOutlined,
} from "@ant-design/icons";
import {
  ScrollReveal,
  HoverLiftCard,
  RippleButton,
  GradientMesh,
  BloodCellParticles,
  PulsingHeart,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    axiosSecure
      .get(`/donation-request/${id}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading request:", err);
        setLoading(false);
        toast.error("Failed to load request");
      });
  }, [id, axiosSecure]);

  const handleDonate = () => {
    if (!user) {
      toast.error("Please log in to donate");
      navigate("/login", { state: { from: `/donation-request/${id}` } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmDonation = async () => {
    if (!user || !request) return;

    setConfirming(true);
    try {
      await axiosSecure.patch(`/donation-request/${id}/donate`, {
        donorName: user.name,
        donorEmail: user.email,
        donation_status: "inprogress",
      });

      setRequest((prev) => ({
        ...prev,
        donation_status: "inprogress",
        donorName: user.name,
        donorEmail: user.email,
      }));

      toast.success("Donation confirmed! Status updated to In Progress.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to confirm donation");
    } finally {
      setConfirming(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axiosSecure.patch(`/donation-request/${id}/update-status`, {
        donation_status: status,
      });
      setRequest((prev) => ({ ...prev, donation_status: status }));
      toast.success(`Donation marked as ${status}!`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen gap-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <PulsingHeart size={64} />
        <Text type="secondary">Loading request details...</Text>
      </div>
    );
  }

  if (!request) {
    return (
      <div className={`p-10 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Result
          status="404"
          title="Request Not Found"
          subTitle="Sorry, the blood donation request you are looking for does not exist."
          extra={
            <Button type="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: "warning", text: "Pending" },
      inprogress: { color: "processing", text: "In Progress" },
      done: { color: "success", text: "Done" },
      canceled: { color: "error", text: "Canceled" },
    };
    const { color, text } = statusMap[status] || {
      color: "default",
      text: status,
    };
    return <Badge status={color} text={text} />;
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-pink-50"
      }`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12">
        <GradientMesh />
        <BloodCellParticles count={10} />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              Back to Requests
            </Button>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <PulsingHeart size={48} />
              </div>
              <Title level={2} className={isDarkMode ? "text-white" : ""}>
                Blood Donation Request
              </Title>
              <Text type="secondary" className="text-lg">
                Help save a life by donating blood
              </Text>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12 -mt-4">
        <ScrollReveal delay={0.2}>
          <HoverLiftCard>
            <Card
              className={`shadow-xl rounded-2xl overflow-hidden border-0 ${
                isDarkMode ? "bg-gray-800" : ""
              }`}
              title={
                <Space>
                  <HeartFilled
                    className="text-red-600"
                    style={{ fontSize: "24px" }}
                  />
                  <Title
                    level={4}
                    style={{ margin: 0 }}
                    className={isDarkMode ? "text-white" : ""}
                  >
                    Request Details
                  </Title>
                </Space>
              }
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Status" span={2}>
                  {getStatusBadge(request.donation_status)}
                </Descriptions.Item>

                <Descriptions.Item label="Recipient">
                  <Space>
                    <UserOutlined className="text-gray-400" />
                    <Text strong>{request.recipientName}</Text>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Blood Group">
                  <span className="inline-block px-3 py-1 text-white bg-red-500 rounded-lg text-lg font-bold">
                    {request.blood_group}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="District">
                  <Space>
                    <EnvironmentOutlined className="text-gray-400" />
                    {request.district}
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Upazila">
                  <Space>
                    <EnvironmentOutlined className="text-gray-400" />
                    {request.upazila}
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Hospital">
                  <Space>
                    <BankOutlined className="text-gray-400" />
                    {request.hospital || "N/A"}
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Address">
                  {request.address || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Donation Date">
                  <Space>
                    <CalendarOutlined className="text-gray-400" />
                    {request.donation_date || "Not set"}
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Donation Time">
                  <Space>
                    <ClockCircleOutlined className="text-gray-400" />
                    {request.donation_time || "Not set"}
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Requester" span={1}>
                  {request.requesterName} ({request.requesterEmail})
                </Descriptions.Item>

                <Descriptions.Item label="Message" span={2}>
                  <Paragraph style={{ margin: 0 }}>
                    <MessageOutlined className="text-gray-400 mr-2" />
                    {request.request_message || "No message provided."}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div className="flex justify-center mt-6">
                {request.donation_status === "pending" && user && (
                  <RippleButton
                    onClick={handleDonate}
                    className="bg-red-600 hover:bg-red-700 text-white px-10 h-12 text-lg font-bold rounded-xl"
                  >
                    <HeartFilled className="mr-2" />
                    Confirm Donation
                  </RippleButton>
                )}

                {user && request.donation_status === "inprogress" && (
                  <Space size="large">
                    <RippleButton
                      onClick={() => handleUpdateStatus("done")}
                      className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 font-bold rounded-xl"
                    >
                      <CheckCircleOutlined className="mr-2" />
                      Mark as Done
                    </RippleButton>
                    <Button
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleUpdateStatus("canceled")}
                      className="h-12 px-8 font-bold rounded-xl"
                    >
                      Cancel Donation
                    </Button>
                  </Space>
                )}

                {request.donation_status === "pending" && !user && (
                  <RippleButton
                    onClick={() => navigate("/login")}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 h-12 font-bold rounded-xl"
                  >
                    Login to Donate
                  </RippleButton>
                )}
              </div>
            </Card>
          </HoverLiftCard>
        </ScrollReveal>
      </div>

      <Modal
        title="Confirm Your Donation"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={confirming}
            onClick={handleConfirmDonation}
          >
            Confirm Donation
          </Button>,
        ]}
      >
        <div className="py-4">
          <Paragraph>
            You are about to confirm your willingness to donate blood for this
            request.
          </Paragraph>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Donor Name">
              {user?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Donor Email">
              {user?.email}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </div>
  );
};

export default DonationRequestDetails;
