import { useState, useEffect, useContext } from "react";
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
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PlusOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  GradientMesh,
  BloodCellParticles,
  RippleButton,
  PulsingHeart,
} from "../../Components/Animations";
import SkeletonCard from "../../Components/Loading/SkeletonCard";
import toast from "react-hot-toast";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Events = () => {
  const { isDarkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [filters, setFilters] = useState({
    district: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
  });

  useEffect(() => {
    axios
      .get("/district.json")
      .then((res) => setDistricts(res.data.districts || []));
    axios
      .get("/upazila.json")
      .then((res) => setUpazilas(res.data.upazilas || []));
  }, []);

  useEffect(() => {
    if (user) {
      axiosSecure.get(`/users/role/${user.email}`).then((res) => {
        setIsAdmin(res.data.role === "admin");
      });
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (filters.district) params.append("district", filters.district);

      const res = await axiosPublic.get(
        `/events/upcoming?${params.toString()}`
      );
      setEvents(res.data.events);
      setPagination((prev) => ({ ...prev, total: res.data.total }));
    } catch (error) {
      console.error("Fetch events error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (values) => {
    try {
      const eventData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
      };

      await axiosSecure.post("/events", eventData);
      toast.success("Event created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchEvents();
    } catch (error) {
      console.error("Create event error:", error);
      toast.error(error.response?.data?.error || "Failed to create event");
    }
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error("Please login to register for events");
      return;
    }

    try {
      await axiosSecure.post(`/events/${eventId}/register`);
      toast.success("Successfully registered for the event!");
      fetchEvents();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Failed to register");
    }
  };

  const isRegistered = (event) => {
    return event.registrations?.some((r) => r.email === user?.email);
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
      <div className="relative overflow-hidden py-16">
        <GradientMesh />
        <BloodCellParticles count={15} />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <CalendarOutlined className="text-6xl text-red-600" />
              </div>
              <Title level={1} className={isDarkMode ? "text-white" : ""}>
                Blood Donation Events
              </Title>
              <Text type="secondary" className="text-lg">
                Join upcoming blood donation camps and save lives
              </Text>
            </div>
          </ScrollReveal>

          {/* Filters and Create Button */}
          <ScrollReveal delay={0.2}>
            <Card
              className={`shadow-xl rounded-2xl ${
                isDarkMode ? "bg-gray-800 border-gray-700" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Select
                  placeholder="Filter by District"
                  value={filters.district || undefined}
                  onChange={(value) => {
                    setFilters({ district: value || "" });
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  allowClear
                  size="large"
                  className="w-full md:w-64"
                  showSearch
                >
                  {districts.map((d) => (
                    <Option key={d.id} value={d.name}>
                      {d.name}
                    </Option>
                  ))}
                </Select>

                {isAdmin && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Create Event
                  </Button>
                )}
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className={isDarkMode ? "bg-gray-800" : ""}>
            <Empty description="No upcoming events found" />
          </Card>
        ) : (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <StaggerItem key={event._id}>
                  <HoverLiftCard>
                    <Card
                      className={`h-full ${
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }`}
                      cover={
                        <div className="h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                          <CalendarOutlined className="text-7xl text-white opacity-50" />
                        </div>
                      }
                    >
                      <Title
                        level={4}
                        className={isDarkMode ? "text-white" : ""}
                      >
                        {event.name}
                      </Title>

                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        className="mb-4"
                      >
                        {event.description}
                      </Paragraph>

                      <Space
                        direction="vertical"
                        size="small"
                        className="w-full mb-4"
                      >
                        <div className="flex items-center gap-2">
                          <CalendarOutlined className="text-red-600" />
                          <Text>
                            {new Date(event.date).toLocaleDateString()}
                          </Text>
                        </div>

                        <div className="flex items-center gap-2">
                          <ClockCircleOutlined className="text-red-600" />
                          <Text>{event.time}</Text>
                        </div>

                        <div className="flex items-center gap-2">
                          <EnvironmentOutlined className="text-red-600" />
                          <Text>
                            {event.district}
                            {event.upazila && `, ${event.upazila}`}
                          </Text>
                        </div>

                        {event.address && (
                          <div className="flex items-center gap-2">
                            <Text type="secondary" className="text-sm">
                              {event.address}
                            </Text>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <TeamOutlined className="text-blue-600" />
                          <Text>
                            {event.registrationCount || 0} / {event.capacity}{" "}
                            registered
                          </Text>
                        </div>
                      </Space>

                      <div className="flex gap-2">
                        {isRegistered(event) ? (
                          <Tag
                            color="green"
                            className="flex-1 text-center py-2"
                          >
                            ✓ Registered
                          </Tag>
                        ) : (
                          <RippleButton
                            onClick={() => handleRegister(event._id)}
                            disabled={event.registrationCount >= event.capacity}
                            className={`flex-1 py-2 rounded-lg font-bold ${
                              event.registrationCount >= event.capacity
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            {event.registrationCount >= event.capacity
                              ? "Full"
                              : "Register Now"}
                          </RippleButton>
                        )}
                      </div>
                    </Card>
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

      {/* Create Event Modal */}
      <Modal
        title="Create Blood Donation Event"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateEvent}>
          <Form.Item
            name="name"
            label="Event Name"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input placeholder="Blood Donation Camp 2024" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Event description..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="district"
              label="District"
              rules={[{ required: true, message: "Please select district" }]}
            >
              <Select
                placeholder="Select District"
                showSearch
                onChange={() => form.setFieldsValue({ upazila: undefined })}
              >
                {districts.map((d) => (
                  <Option key={d.id} value={d.name}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.district !== curr.district}
            >
              {({ getFieldValue }) => (
                <Form.Item name="upazila" label="Upazila">
                  <Select
                    placeholder="Select Upazila"
                    disabled={!getFieldValue("district")}
                    showSearch
                  >
                    {upazilas
                      .filter((u) => {
                        const dist = districts.find(
                          (d) => d.name === getFieldValue("district")
                        );
                        return dist && u.district_id === dist.id;
                      })
                      .map((u) => (
                        <Option key={u.id} value={u.name}>
                          {u.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
          </div>

          <Form.Item name="address" label="Address">
            <Input placeholder="Venue address" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select time" }]}
            >
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="capacity"
              label="Capacity"
              initialValue={100}
              rules={[{ required: true, message: "Please enter capacity" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="organizer" label="Organizer">
              <Input placeholder="Organization name" />
            </Form.Item>
          </div>

          <Form.Item className="mb-0">
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="bg-red-600">
                Create Event
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Events;
