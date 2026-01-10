import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  TimePicker,
  Card,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import {
  HeartFilled,
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddRequest = () => {
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axios
      .get("/district.json")
      .then((res) => {
        if (res.data?.districts) setDistricts(res.data.districts);
      })
      .catch((err) => console.error("District load error:", err));

    axios
      .get("/upazila.json")
      .then((res) => {
        if (res.data?.upazilas) setUpazilas(res.data.upazilas);
      })
      .catch((err) => console.error("Upazila load error:", err));
  }, []);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const requestData = {
        requesterName: user?.name,
        requesterEmail: user?.email,
        recipientName: values.recipientName,
        district: districts.find((d) => d.id === values.district)?.name || "",
        upazila: values.upazila,
        hospital: values.hospital,
        address: values.address,
        request_message: values.request_message,
        blood_group: values.blood_group,
        donation_date: values.donation_date.format("YYYY-MM-DD"),
        donation_time: values.donation_time.format("HH:mm"),
        donation_status: "pending",
        createdAt: new Date(),
      };

      await axiosSecure.post("/requests", requestData);
      toast.success("Blood request submitted successfully! 🎉");
      form.resetFields();
      setSelectedDistrict(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    form.setFieldsValue({ upazila: undefined });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Space direction="vertical" align="center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <HeartFilled style={{ fontSize: "32px", color: "#fff" }} />
            </div>
            <Title level={2} style={{ margin: "8px 0 0 0" }}>
              Create Blood Request
            </Title>
            <Text type="secondary">
              Fill in the details to request blood donation
            </Text>
          </Space>
        </div>

        <Card className="shadow-xl rounded-2xl border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              requesterName: user?.name,
              requesterEmail: user?.email,
            }}
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Requester Name" name="requesterName">
                  <Input prefix={<UserOutlined />} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Requester Email" name="requesterEmail">
                  <Input prefix={<MailOutlined />} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Recipient Name"
                  name="recipientName"
                  rules={[
                    { required: true, message: "Please enter recipient name" },
                  ]}
                >
                  <Input placeholder="Full Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Blood Group"
                  name="blood_group"
                  rules={[
                    { required: true, message: "Please select blood group" },
                  ]}
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
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="District"
                  name="district"
                  rules={[
                    { required: true, message: "Please select district" },
                  ]}
                >
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
                  label="Upazila"
                  name="upazila"
                  rules={[{ required: true, message: "Please select upazila" }]}
                >
                  <Select
                    placeholder="Select Upazila"
                    disabled={!selectedDistrict}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {upazilas
                      .filter((u) => u.district_id === selectedDistrict)
                      .map((u) => (
                        <Option key={u.id} value={u.name}>
                          {u.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Hospital Name"
                  name="hospital"
                  rules={[
                    { required: true, message: "Please enter hospital name" },
                  ]}
                >
                  <Input
                    prefix={<BankOutlined />}
                    placeholder="e.g. Dhaka Medical College"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Address"
                  name="address"
                  rules={[{ required: true, message: "Please enter address" }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Street, area, landmarks"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Donation Date"
                  name="donation_date"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Donation Time"
                  name="donation_time"
                  rules={[{ required: true, message: "Please select time" }]}
                >
                  <TimePicker style={{ width: "100%" }} format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Request Message" name="request_message">
              <TextArea rows={4} placeholder="Any additional information..." />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="bg-red-600 h-12 text-lg font-bold"
              >
                Submit Blood Request
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddRequest;
