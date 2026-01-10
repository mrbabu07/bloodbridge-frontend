import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Descriptions,
  Spin,
  Alert,
  Space,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import {
  ScrollReveal,
  HoverLiftCard,
  GradientMesh,
  PulsingHeart,
} from "../../Components/Animations";

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const axiosSecure = useAxiosSecure();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load district/upazila JSON
  useEffect(() => {
    axios
      .get("/district.json")
      .then((res) => setDistricts(res.data.districts || []))
      .catch((err) => console.error("District load error:", err));
    axios
      .get("/upazila.json")
      .then((res) => setUpazilas(res.data.upazilas || []))
      .catch((err) => console.error("Upazila load error:", err));
  }, []);

  // Fetch profile
  const fetchProfile = async () => {
    if (!user?.email) {
      console.log("No user email yet, skipping profile fetch");
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching profile for:", user.email);
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      console.log("Profile Data received:", res.data);

      if (res.data && typeof res.data === "object") {
        setProfile(res.data);
      } else {
        console.warn("Profile data is invalid or empty:", res.data);
        setProfile(null);
      }
    } catch (err) {
      console.error("Profile load error:", err);
      toast.error("Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Safety: if after 3 seconds we are still loading, something is wrong
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [user?.email, axiosSecure]);

  const handleSync = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await axiosSecure.post("/users", {
        name: user.displayName || "Unknown User",
        email: user.email?.toLowerCase(),
        bloodGroup: "Not set",
        district: "Not set",
        upazila: "Not set",
        photoURL: user.photoURL || "",
        role: "donor",
        status: "active",
      });
      toast.success("Profile synced successfully! 🎉");
      fetchProfile();
    } catch (err) {
      console.error("Sync error:", err);
      toast.error("Failed to sync profile. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await axiosSecure.patch("/users/profile", {
        ...values,
        district:
          districts.find((d) => d.id === values.district)?.name ||
          values.district,
        photoURL: profile.photoURL,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDistrictChange = () => {
    form.setFieldsValue({ upazila: undefined });
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen gap-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <PulsingHeart size={64} />
        <Text type="secondary">Loading profile...</Text>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`p-10 flex flex-col items-center justify-center min-h-[50vh] gap-6 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Alert
          message="Profile Record Not Found"
          description="We couldn't find your blood bridge profile in our records. This might happen if your account was not fully synced during registration."
          type="warning"
          showIcon
          className="w-full max-w-xl shadow-sm"
        />
        <Space size="middle">
          <Button
            type="primary"
            onClick={handleSync}
            loading={saving}
            icon={<SyncOutlined />}
          >
            Sync Missing Profile
          </Button>
          <Button onClick={fetchProfile} icon={<UserOutlined />}>
            Try Reloading
          </Button>
          <Button onClick={() => (window.location.href = "/")}>
            Return Home
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-pink-50"
      }`}
    >
      {/* Hero Background */}
      <div className="relative overflow-hidden">
        <GradientMesh />
        <div className="h-32" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 pb-12">
        <ScrollReveal>
          <HoverLiftCard>
            <Card
              className={`shadow-xl rounded-2xl overflow-hidden border-0 ${
                isDarkMode ? "bg-gray-800" : ""
              }`}
            >
              <div className="flex flex-col items-center mb-6">
                <Avatar
                  size={120}
                  src={profile.photoURL}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                />
                <Title
                  level={2}
                  className={`mt-4 mb-0 ${isDarkMode ? "text-white" : ""}`}
                >
                  {profile.name}
                </Title>
                <Text type="secondary" className="text-lg">
                  {profile.role
                    ? profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)
                    : "Member"}
                </Text>
              </div>

              <div className="flex justify-end mb-6">
                {!isEditing ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Space>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Space>
                )}
              </div>

              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    name: profile.name,
                    bloodGroup: profile.bloodGroup,
                    district:
                      districts.find(
                        (d) =>
                          d.name === profile.district ||
                          d.id === profile.district
                      )?.id || profile.district,
                    upazila: profile.upazila,
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[
                          { required: true, message: "Please enter your name" },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="John Doe"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="bloodGroup" label="Blood Group">
                        <Select placeholder="Select Blood Group">
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((bg) => (
                            <Option key={bg} value={bg}>
                              {bg}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="district" label="District">
                        <Select
                          placeholder="Select District"
                          onChange={handleDistrictChange}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {districts.map((d) => (
                            <Option key={d.id} value={d.id}>
                              {d.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.district !== currentValues.district
                        }
                      >
                        {({ getFieldValue }) => (
                          <Form.Item name="upazila" label="Upazila">
                            <Select
                              placeholder="Select Upazila"
                              disabled={!getFieldValue("district")}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.children ?? "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {upazilas
                                .filter(
                                  (u) =>
                                    u.district_id === getFieldValue("district")
                                )
                                .map((u) => (
                                  <Option key={u.id} value={u.name}>
                                    {u.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item className="mt-6">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={saving}
                      icon={<SaveOutlined />}
                      block
                      className="bg-red-600"
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Descriptions
                  bordered
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  className="mt-4"
                >
                  <Descriptions.Item label="Email" span={2}>
                    <Space>
                      <MailOutlined className="text-gray-400" />
                      {profile.email}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Blood Group">
                    <Text strong className="text-red-600">
                      {profile.bloodGroup || "Not set"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="District">
                    <Space>
                      <EnvironmentOutlined className="text-gray-400" />
                      {districts.find((d) => d.id === profile.district)?.name ||
                        profile.district ||
                        "Not set"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Upazila">
                    <Space>
                      <EnvironmentOutlined className="text-gray-400" />
                      {profile.upazila || "Not set"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Text
                      type={profile.status === "active" ? "success" : "danger"}
                      strong
                      className="capitalize"
                    >
                      {profile.status === "active" && (
                        <CheckCircleOutlined className="mr-1" />
                      )}
                      {profile.status}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </HoverLiftCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Profile;
