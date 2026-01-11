import { useState, useEffect } from "react";
import { useTheme } from "../../Context/ThemeContext";
import useAxios from "../../hooks/useAxios";
import {
  Card,
  Input,
  Select,
  Button,
  Avatar,
  Empty,
  Pagination,
  Space,
  Typography,
  Tag,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EnvironmentOutlined,
  HeartFilled,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  GradientMesh,
  BloodCellParticles,
  PulsingHeart,
} from "../../Components/Animations";
import SkeletonCard from "../../Components/Loading/SkeletonCard";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const DonorSearch = () => {
  const { isDarkMode } = useTheme();
  const axiosPublic = useAxios();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
    sortBy: "recent",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
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
    searchDonors();
  }, [pagination.page, filters]);

  const searchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
      });

      if (filters.bloodGroup) params.append("bloodGroup", filters.bloodGroup);
      if (filters.district) params.append("district", filters.district);
      if (filters.upazila) params.append("upazila", filters.upazila);

      const res = await axiosPublic.get(`/donors/search?${params.toString()}`);
      setDonors(res.data.donors);
      setPagination((prev) => ({ ...prev, total: res.data.total }));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDistrictChange = (value) => {
    setFilters((prev) => ({ ...prev, district: value, upazila: "" }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
                <PulsingHeart size={56} />
              </div>
              <Title level={1} className={isDarkMode ? "text-white" : ""}>
                Find Blood Donors
              </Title>
              <Text type="secondary" className="text-lg">
                Search for available blood donors in your area
              </Text>
            </div>
          </ScrollReveal>

          {/* Search Filters */}
          <ScrollReveal delay={0.2}>
            <Card
              className={`shadow-xl rounded-2xl ${
                isDarkMode ? "bg-gray-800 border-gray-700" : ""
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select
                  placeholder="Blood Group"
                  value={filters.bloodGroup || undefined}
                  onChange={(value) => handleFilterChange("bloodGroup", value)}
                  allowClear
                  size="large"
                  className="w-full"
                >
                  {bloodGroups.map((bg) => (
                    <Option key={bg} value={bg}>
                      <span className="text-red-600 font-bold">{bg}</span>
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Select District"
                  value={filters.district || undefined}
                  onChange={handleDistrictChange}
                  allowClear
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {districts.map((d) => (
                    <Option key={d.id} value={d.name}>
                      {d.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Select Upazila"
                  value={filters.upazila || undefined}
                  onChange={(value) => handleFilterChange("upazila", value)}
                  allowClear
                  size="large"
                  disabled={!filters.district}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {upazilas
                    .filter((u) => {
                      const district = districts.find(
                        (d) => d.name === filters.district
                      );
                      return district && u.district_id === district.id;
                    })
                    .map((u) => (
                      <Option key={u.id} value={u.name}>
                        {u.name}
                      </Option>
                    ))}
                </Select>

                <Select
                  value={filters.sortBy}
                  onChange={(value) => handleFilterChange("sortBy", value)}
                  size="large"
                >
                  <Option value="recent">Recent Activity</Option>
                  <Option value="donations">Most Donations</Option>
                </Select>

                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={searchDonors}
                  className="bg-red-600 hover:bg-red-700"
                  block
                >
                  Search
                </Button>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ScrollReveal delay={0.3}>
          <div className="mb-6">
            <Text
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Found{" "}
              <span className="font-bold text-red-600">{pagination.total}</span>{" "}
              donors
            </Text>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <Card className={isDarkMode ? "bg-gray-800" : ""}>
            <Empty description="No donors found. Try adjusting your filters." />
          </Card>
        ) : (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donors.map((donor) => (
                <StaggerItem key={donor._id}>
                  <HoverLiftCard>
                    <Card
                      className={`h-full ${
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Avatar
                          size={80}
                          src={donor.photoURL}
                          icon={<UserOutlined />}
                          className="mb-4 border-4 border-red-100"
                        />

                        <Title
                          level={4}
                          className={`mb-2 ${isDarkMode ? "text-white" : ""}`}
                        >
                          {donor.name}
                        </Title>

                        <Tag color="red" className="text-lg font-bold mb-3">
                          {donor.bloodGroup}
                        </Tag>

                        <Space
                          direction="vertical"
                          size="small"
                          className="w-full mb-4"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <EnvironmentOutlined className="text-gray-400" />
                            <Text type="secondary">
                              {donor.district}
                              {donor.upazila && `, ${donor.upazila}`}
                            </Text>
                          </div>

                          {donor.donationCount > 0 && (
                            <div className="flex items-center justify-center gap-2">
                              <TrophyOutlined className="text-yellow-500" />
                              <Text strong className="text-yellow-600">
                                {donor.donationCount} Donations
                              </Text>
                            </div>
                          )}
                        </Space>

                        <Tag
                          color={donor.role === "volunteer" ? "blue" : "green"}
                          className="capitalize"
                        >
                          {donor.role}
                        </Tag>
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
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} donors`
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonorSearch;
