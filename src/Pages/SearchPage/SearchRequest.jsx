import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { motion } from "framer-motion";
import {
  Form,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  List,
  Space,
  Empty,
  Spin,
  message,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../Context/ThemeContext";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  BloodCellParticles,
  GradientMesh,
} from "../../Components/Animations";

const { Title, Text } = Typography;
const { Option } = Select;

function SearchRequest() {
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const { isDarkMode, theme } = useTheme();
  // Using Ant Design Form instance
  const [form] = Form.useForm();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Load districts and upazilas from JSON
  useEffect(() => {
    axios.get("/district.json").then((res) => setDistricts(res.data.districts));
    axios.get("/upazila.json").then((res) => setUpazilas(res.data.upazilas));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    setRequests([]);
    const { bloodGroup, district, upazila } = values;

    try {
      const params = new URLSearchParams();
      if (bloodGroup) params.append("blood_group", bloodGroup);
      if (district) params.append("district", district);
      if (upazila) params.append("upazila", upazila);

      const res = await axiosPublic.get(
        `/donation-request?${params.toString()}`
      );

      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to search requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    form.setFieldsValue({ upazila: undefined }); // Reset upazila when district changes
  };

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-8">
            <Title level={2} style={{ color: theme.colors.text }}>
              Search Blood Requests
            </Title>
            <Text style={{ color: theme.colors.textSecondary }}>
              Find available blood donation requests in your area
            </Text>
            <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Search Form */}
        <ScrollReveal delay={0.1}>
          <HoverLiftCard liftAmount={-4}>
            <Card style={cardStyle} className="shadow-md mb-8 border-0">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="bloodGroup"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          Blood Group
                        </Text>
                      }
                    >
                      <Select placeholder="Select Blood Group">
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <Option key={bg} value={bg}>
                              {bg}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name="district"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          District
                        </Text>
                      }
                    >
                      <Select
                        placeholder="Select District"
                        onChange={handleDistrictChange}
                        showSearch
                      >
                        {districts.map((d) => (
                          <Option key={d.id} value={d.name}>
                            {d.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      name="upazila"
                      label={
                        <Text style={{ color: theme.colors.text }}>
                          Upazila
                        </Text>
                      }
                    >
                      <Select
                        placeholder="Select Upazila"
                        disabled={!selectedDistrict}
                        showSearch
                      >
                        {upazilas
                          .filter(
                            (u) =>
                              u.district_id ===
                              districts.find((d) => d.name === selectedDistrict)
                                ?.id
                          )
                          .map((u) => (
                            <Option key={u.id} value={u.name}>
                              {u.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      icon={<SearchOutlined />}
                      className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 h-12 rounded-lg"
                    >
                      Search Requests
                    </Button>
                  </motion.div>
                </Form.Item>
              </Form>
            </Card>
          </HoverLiftCard>
        </ScrollReveal>

        {/* Results */}
        <div className="results-section">
          <StaggerContainer>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={requests}
              locale={{
                emptyText: loading ? (
                  <Spin />
                ) : (
                  <Empty description="No requests found" />
                ),
              }}
              renderItem={(req) => (
                <List.Item>
                  <StaggerItem>
                    <HoverLiftCard>
                      <Card
                        style={cardStyle}
                        className="shadow-sm border-0"
                        actions={[
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              type="primary"
                              danger
                              onClick={() =>
                                navigate(`/donation-request/${req._id}`)
                              }
                            >
                              View Details
                            </Button>
                          </motion.div>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <motion.span
                              className="inline-block px-3 py-2 text-white bg-red-500 rounded-lg text-base font-bold"
                              whileHover={{ scale: 1.1 }}
                            >
                              {req.blood_group}
                            </motion.span>
                          }
                          title={
                            <Text
                              strong
                              style={{
                                fontSize: "18px",
                                color: theme.colors.text,
                              }}
                            >
                              {req.recipientName}
                            </Text>
                          }
                          description={
                            <Text style={{ color: theme.colors.textSecondary }}>
                              {req.hospital}
                            </Text>
                          }
                        />
                        <Space
                          direction="vertical"
                          style={{ marginTop: "16px", width: "100%" }}
                        >
                          <Space>
                            <EnvironmentOutlined style={{ color: "#dc2626" }} />
                            <Text style={{ color: theme.colors.textSecondary }}>
                              {req.upazila}, {req.district}
                            </Text>
                          </Space>
                          <Space>
                            <CalendarOutlined style={{ color: "#dc2626" }} />
                            <Text style={{ color: theme.colors.textSecondary }}>
                              {req.donation_date}
                            </Text>
                            <ClockCircleOutlined
                              style={{ color: "#dc2626", marginLeft: "8px" }}
                            />
                            <Text style={{ color: theme.colors.textSecondary }}>
                              {req.donation_time}
                            </Text>
                          </Space>
                        </Space>
                      </Card>
                    </HoverLiftCard>
                  </StaggerItem>
                </List.Item>
              )}
            />
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}

export default SearchRequest;
