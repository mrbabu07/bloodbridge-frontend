import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useTheme } from "../../Context/ThemeContext";
import { Table, Card, Select, Typography, Space, Pagination } from "antd";
import { UnorderedListOutlined, HeartFilled } from "@ant-design/icons";
import {
  ScrollReveal,
  HoverLiftCard,
  PulsingHeart,
} from "../../Components/Animations";

const { Title } = Typography;
const { Option } = Select;

const statuses = ["all", "pending", "inprogress", "done", "canceled"];

const MyRequest = () => {
  const [myRequest, setMyRequest] = useState([]);
  const [totalRequest, setTotalRequest] = useState(0);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const requestsPerPage = 5;
  const { isDarkMode } = useTheme();

  const axiosSecure = useAxiosSecure();

  const fetchMyRequest = async (page = 0, size = requestsPerPage) => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/my-request?page=${page}&size=${size}`
      );
      setMyRequest(res.data.request || []);
      setTotalRequest(res.data.totalRequest || 0);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequest(currentPage - 1);
  }, [axiosSecure, currentPage]);

  const getStatusColorClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "inprogress":
        return "bg-blue-500";
      case "done":
        return "bg-green-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) =>
        (currentPage - 1) * requestsPerPage + index + 1,
    },
    {
      title: "Recipient",
      dataIndex: "recipientName",
      key: "recipientName",
      sorter: (a, b) => a.recipientName.localeCompare(b.recipientName),
    },
    {
      title: "Blood Group",
      dataIndex: "blood_group",
      key: "blood_group",
      render: (bg) => (
        <span className="inline-block px-2 py-1 text-white bg-red-500 rounded text-sm font-medium">
          {bg}
        </span>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (text, record) => `${record.district}, ${record.upazila}`,
    },
    {
      title: "Date",
      dataIndex: "donation_date",
      key: "donation_date",
    },
    {
      title: "Time",
      dataIndex: "donation_time",
      key: "donation_time",
    },
    {
      title: "Status",
      dataIndex: "donation_status",
      key: "donation_status",
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 text-white rounded text-sm font-medium capitalize ${getStatusColorClass(
            status
          )}`}
        >
          {status}
        </span>
      ),
    },
  ];

  const filteredData =
    filteredStatus === "all"
      ? myRequest
      : myRequest.filter((req) => req.donation_status === filteredStatus);

  return (
    <div
      className={`p-6 min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <ScrollReveal>
        <HoverLiftCard>
          <Card
            title={
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <Space>
                  <HeartFilled
                    className="text-red-600"
                    style={{ fontSize: "20px" }}
                  />
                  <Title
                    level={4}
                    style={{ margin: 0 }}
                    className={isDarkMode ? "text-white" : ""}
                  >
                    My Blood Requests
                  </Title>
                </Space>
                <Space>
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Filter by Status:
                  </span>
                  <Select
                    value={filteredStatus}
                    onChange={(value) => {
                      setFilteredStatus(value);
                      setCurrentPage(1);
                    }}
                    style={{ width: 150 }}
                  >
                    {statuses.map((status) => (
                      <Option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </div>
            }
            className={`shadow-md rounded-xl ${
              isDarkMode ? "bg-gray-800 border-gray-700" : ""
            }`}
          >
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="_id"
              loading={loading}
              pagination={false}
              scroll={{ x: 800 }}
            />
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={totalRequest}
                pageSize={requestsPerPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </Card>
        </HoverLiftCard>
      </ScrollReveal>
    </div>
  );
};

export default MyRequest;
