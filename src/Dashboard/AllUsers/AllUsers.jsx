import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useTheme } from "../../Context/ThemeContext";
import {
  Table,
  Button,
  Avatar,
  Space,
  Typography,
  Input,
  Select,
  Dropdown,
  Card,
  Modal,
  Form,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MoreOutlined,
  UserAddOutlined,
  StopOutlined,
  CrownOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverLiftCard,
  AnimatedCounter,
} from "../../Components/Animations";

const { Title, Text } = Typography;

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({});
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterRole !== "all") params.append("role", filterRole);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const [usersRes, statsRes] = await Promise.all([
        axiosSecure.get(`/users?${params.toString()}`),
        axiosSecure.get("/users/stats"),
      ]);

      setUsers(usersRes.data.users || usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus]);

  const handleStatusChange = async (email, status) => {
    try {
      const res = await axiosSecure.patch(
        `/update/user/status?email=${email}&status=${status}`
      );
      if (res.data?.success) {
        toast.success(`User ${status} successfully!`);
        fetchUsers();
      }
    } catch (err) {
      console.error("Status update failed:", err);
      const errorMsg = err.response?.data?.error || "Status update failed";
      toast.error(errorMsg);
    }
  };

  const handleRoleChange = async (values) => {
    try {
      const { newRole } = values;
      await axiosSecure.patch("/users/role", {
        email: selectedUser.email,
        newRole,
      });
      toast.success(`User role updated to ${newRole} successfully!`);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      form.resetFields();
      fetchUsers();
    } catch (err) {
      console.error("Role update failed:", err);
      const errorMsg = err.response?.data?.error || "Role update failed";
      toast.error(errorMsg);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({ newRole: user.role });
    setIsRoleModalOpen(true);
  };

  const getMenuItems = (record) => [
    {
      key: "change-role",
      icon: <UserSwitchOutlined />,
      label: "Change Role",
      onClick: () => openRoleModal(record),
    },
    {
      type: "divider",
    },
    {
      key: "activate",
      icon: <UserAddOutlined />,
      label: "Activate",
      disabled: record.status === "active",
      onClick: () => handleStatusChange(record.email, "active"),
    },
    {
      key: "block",
      danger: true,
      icon: <StopOutlined />,
      label: "Block",
      disabled: record.status === "blocked",
      onClick: () => handleStatusChange(record.email, "blocked"),
    },
  ];

  const columns = [
    {
      title: "User",
      key: "user",
      render: (text, record) => (
        <Space>
          <Avatar src={record.photoURL} icon={<UserOutlined />} />
          <div>
            <Text strong block>
              {record.name}
            </Text>
            <Text type="secondary" size="small">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colorClasses = {
          admin: "bg-orange-500",
          volunteer: "bg-blue-500",
          donor: "bg-green-500",
        };
        const icons = {
          admin: <CrownOutlined />,
          volunteer: <TeamOutlined />,
          donor: <UserOutlined />,
        };
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-white rounded text-sm font-medium capitalize ${colorClasses[role]}`}
          >
            {icons[role]}
            {role}
          </span>
        );
      },
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Volunteer", value: "volunteer" },
        { text: "Donor", value: "donor" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 text-white rounded text-sm font-medium capitalize ${
            status === "active" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {status}
        </span>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Blocked", value: "blocked" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (bloodGroup) =>
        bloodGroup ? (
          <span className="inline-block px-2 py-1 text-white bg-red-500 rounded text-sm font-medium">
            {bloodGroup}
          </span>
        ) : (
          <Text type="secondary">Not set</Text>
        ),
    },
    {
      title: "Location",
      key: "location",
      render: (text, record) => (
        <div>
          {record.district && record.upazila ? (
            <>
              <Text>{record.district}</Text>
              <br />
              <Text type="secondary" size="small">
                {record.upazila}
              </Text>
            </>
          ) : (
            <Text type="secondary">Not set</Text>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
          <Button icon={<MoreOutlined />} shape="circle" />
        </Dropdown>
      ),
    },
  ];

  const filteredData = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const getRoleStats = () => {
    const roleStats = stats.roleStats || [];
    const roleMap = roleStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      admin: roleMap.admin || 0,
      volunteer: roleMap.volunteer || 0,
      donor: roleMap.donor || 0,
    };
  };

  const roleStats = getRoleStats();

  return (
    <div
      className={`p-6 min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Statistics Cards */}
      <ScrollReveal>
        <StaggerContainer className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
                  >
                    <Statistic
                      title={
                        <span className={isDarkMode ? "text-gray-400" : ""}>
                          Total Users
                        </span>
                      }
                      value={stats.totalUsers || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                      formatter={(value) => (
                        <AnimatedCounter end={value} duration={1.5} />
                      )}
                    />
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={6}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
                  >
                    <Statistic
                      title={
                        <span className={isDarkMode ? "text-gray-400" : ""}>
                          Admins
                        </span>
                      }
                      value={roleStats.admin}
                      prefix={<CrownOutlined />}
                      valueStyle={{ color: "#f5222d" }}
                      formatter={(value) => (
                        <AnimatedCounter end={value} duration={1.5} />
                      )}
                    />
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={6}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
                  >
                    <Statistic
                      title={
                        <span className={isDarkMode ? "text-gray-400" : ""}>
                          Volunteers
                        </span>
                      }
                      value={roleStats.volunteer}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                      formatter={(value) => (
                        <AnimatedCounter end={value} duration={1.5} />
                      )}
                    />
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={6}>
              <StaggerItem>
                <HoverLiftCard>
                  <Card
                    className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
                  >
                    <Statistic
                      title={
                        <span className={isDarkMode ? "text-gray-400" : ""}>
                          Donors
                        </span>
                      }
                      value={roleStats.donor}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                      formatter={(value) => (
                        <AnimatedCounter end={value} duration={1.5} />
                      )}
                    />
                  </Card>
                </HoverLiftCard>
              </StaggerItem>
            </Col>
          </Row>
        </StaggerContainer>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <HoverLiftCard>
          <Card
            title={
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <Title
                  level={4}
                  style={{ margin: 0 }}
                  className={isDarkMode ? "text-white" : ""}
                >
                  User Management
                </Title>
                <Space wrap>
                  <Input
                    placeholder="Search by name or email"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250 }}
                  />
                  <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => setFilterRole(value)}
                  >
                    <Select.Option value="all">All Roles</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="volunteer">Volunteer</Select.Option>
                    <Select.Option value="donor">Donor</Select.Option>
                  </Select>
                  <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => setFilterStatus(value)}
                  >
                    <Select.Option value="all">All Status</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="blocked">Blocked</Select.Option>
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
              rowKey="email"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </HoverLiftCard>
      </ScrollReveal>

      {/* Role Change Modal */}
      <Modal
        title={
          <Space>
            <UserSwitchOutlined />
            Change User Role
          </Space>
        }
        open={isRoleModalOpen}
        onCancel={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        {selectedUser && (
          <div className="py-4">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <Space>
                <Avatar src={selectedUser.photoURL} icon={<UserOutlined />} />
                <div>
                  <Text strong block>
                    {selectedUser.name}
                  </Text>
                  <Text type="secondary">{selectedUser.email}</Text>
                  <br />
                  <Text type="secondary">Current Role: </Text>
                  <span
                    className={`inline-block px-2 py-1 text-white rounded text-sm font-medium capitalize ${
                      selectedUser.role === "admin"
                        ? "bg-orange-500"
                        : selectedUser.role === "volunteer"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
              </Space>
            </div>

            <Form form={form} onFinish={handleRoleChange} layout="vertical">
              <Form.Item
                name="newRole"
                label="New Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select size="large">
                  <Select.Option value="donor">
                    <Space>
                      <UserOutlined />
                      Donor
                    </Space>
                  </Select.Option>
                  <Select.Option value="volunteer">
                    <Space>
                      <TeamOutlined />
                      Volunteer
                    </Space>
                  </Select.Option>
                  <Select.Option value="admin">
                    <Space>
                      <CrownOutlined />
                      Admin
                    </Space>
                  </Select.Option>
                </Select>
              </Form.Item>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setIsRoleModalOpen(false);
                    setSelectedUser(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" danger>
                  Update Role
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllUsers;
