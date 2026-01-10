import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeContext";
import {
  Card,
  Button,
  Typography,
  Pagination,
  Empty,
  Row,
  Col,
  Input,
  Select,
  Skeleton,
  Space,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HeartFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  BloodCellParticles,
  GradientMesh,
} from "../../Components/Animations";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const DonationRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const axios = useAxios();
  const { user } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [currentPage, bloodGroupFilter, sortBy]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let url = `/donation-request?status=pending&page=${currentPage}&size=8`;
      if (bloodGroupFilter) url += `&blood_group=${bloodGroupFilter}`;
      if (sortBy === "newest") url += `&sort=-createdAt`;
      if (sortBy === "oldest") url += `&sort=createdAt`;

      const res = await axios.get(url);
      setRequests(res.data.requests || []);
      setTotalItems(res.data.totalRequests || res.data.totalPages * 8);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    if (!user) {
      navigate("/login", { state: { from: `/donation-request/${id}` } });
    } else {
      navigate(`/donation-request/${id}`);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.upazila?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: "16px",
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Skeleton Card Component
  const SkeletonCard = () => (
    <Card style={cardStyle} className="h-full">
      <Skeleton avatar active paragraph={{ rows: 3 }} />
    </Card>
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <Title
              level={2}
              style={{ color: theme.colors.text, marginBottom: 8 }}
            >
              Blood Donation Requests
            </Title>
            <Paragraph
              style={{ color: theme.colors.textSecondary, fontSize: "16px" }}
            >
              Help save lives by responding to these urgent blood requests
            </Paragraph>
            <div className="w-20 h-1 bg-red-500 mx-auto mt-4 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Filters */}
        <Card style={cardStyle} className="mb-6 border-0 shadow-md">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <Input
                placeholder="Search by name, district, or upazila..."
                prefix={
                  <SearchOutlined
                    style={{ color: theme.colors.textSecondary }}
                  />
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg"
                size="large"
              />
            </Col>
            <Col xs={12} md={7}>
              <Select
                placeholder="Blood Group"
                value={bloodGroupFilter}
                onChange={setBloodGroupFilter}
                className="w-full"
                size="large"
                allowClear
              >
                <Option value="">All Blood Groups</Option>
                {bloodGroups.map((bg) => (
                  <Option key={bg} value={bg}>
                    {bg}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={7}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="w-full"
                size="large"
              >
                <Option value="newest">Newest First</Option>
                <Option value="oldest">Oldest First</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <Text style={{ color: theme.colors.textSecondary }}>
            Showing {filteredRequests.length} of {totalItems} requests
          </Text>
        </div>

        {/* Cards Grid - 4 per row on desktop */}
        {loading ? (
          <Row gutter={[16, 16]}>
            {[...Array(8)].map((_, idx) => (
              <Col xs={24} sm={12} lg={6} key={idx}>
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        ) : filteredRequests.length === 0 ? (
          <Card style={cardStyle} className="text-center py-12">
            <Empty
              description={
                <Text style={{ color: theme.colors.textSecondary }}>
                  No pending requests found
                </Text>
              }
            />
          </Card>
        ) : (
          <StaggerContainer>
            <Row gutter={[16, 16]}>
              {filteredRequests.map((request, idx) => (
                <Col xs={24} sm={12} lg={6} key={request._id}>
                  <StaggerItem>
                    <HoverLiftCard>
                      <Card
                        style={cardStyle}
                        className="h-full border-0 shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => handleView(request._id)}
                      >
                        {/* Blood Group Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <motion.div
                            className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {request.blood_group}
                          </motion.div>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        </div>

                        {/* Recipient Info */}
                        <Title
                          level={5}
                          style={{ color: theme.colors.text, marginBottom: 8 }}
                          className="line-clamp-1"
                        >
                          {request.recipientName}
                        </Title>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={14} className="text-gray-400" />
                          <Text
                            style={{
                              color: theme.colors.textSecondary,
                              fontSize: "13px",
                            }}
                            className="line-clamp-1"
                          >
                            {request.district}, {request.upazila}
                          </Text>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            <Text
                              style={{
                                color: theme.colors.textSecondary,
                                fontSize: "12px",
                              }}
                            >
                              {request.donation_date || "Not set"}
                            </Text>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-400" />
                            <Text
                              style={{
                                color: theme.colors.textSecondary,
                                fontSize: "12px",
                              }}
                            >
                              {request.donation_time || "Not set"}
                            </Text>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          type="primary"
                          block
                          icon={<EyeOutlined />}
                          className="bg-red-500 border-red-500 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(request._id);
                          }}
                        >
                          View Details
                        </Button>
                      </Card>
                    </HoverLiftCard>
                  </StaggerItem>
                </Col>
              ))}
            </Row>
          </StaggerContainer>
        )}

        {/* Pagination */}
        {!loading && filteredRequests.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={totalItems}
              pageSize={8}
              showSizeChanger={false}
              showTotal={(total, range) => (
                <Text style={{ color: theme.colors.textSecondary }}>
                  {range[0]}-{range[1]} of {total} requests
                </Text>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequest;
