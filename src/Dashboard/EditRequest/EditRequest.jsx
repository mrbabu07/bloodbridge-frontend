import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";
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
  Spin,
} from "antd";
import {
  EditOutlined,
  HeartFilled,
  EnvironmentOutlined,
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [form] = Form.useForm();
  
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Load districts & upazilas
  useEffect(() => {
    axios.get("/district.json").then((res) => {
      setDistricts(res.data.districts || []);
    });
    axios.get("/upazila.json").then((res) => {
      setUpazilas(res.data.upazilas || []);
    });
  }, []);

  // Load request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axiosSecure.get(`/donation-request/${id}`);
        const data = res.data;
        
        // Find district ID from name to pre-populate select correctly
        const districtObj = districts.find(d => d.name === data.district || d.id === data.district);
        const districtId = districtObj ? districtObj.id : null;
        setSelectedDistrict(districtId);

        setRequest({
          ...data,
          district: districtId,
          donation_date: data.donation_date ? dayjs(data.donation_date) : null,
          donation_time: data.donation_time ? dayjs(data.donation_time, "HH:mm") : null,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load request", err);
        toast.error("Failed to load request");
        navigate("/dashboard/my-request");
      }
    };

    if (districts.length > 0) {
      fetchRequest();
    }
  }, [id, axiosSecure, navigate, districts]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const updateData = {
        recipientName: values.recipientName,
        blood_group: values.blood_group,
        district: districts.find(d => d.id === values.district)?.name || values.district,
        upazila: values.upazila,
        hospital: values.hospital,
        address: values.address,
        request_message: values.request_message,
        donation_date: values.donation_date.format("YYYY-MM-DD"),
        donation_time: values.donation_time.format("HH:mm"),
      };

      await axiosSecure.put(`/requests/${id}`, updateData);
      toast.success("Request updated successfully! 🎉");
      navigate("/dashboard/my-request");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    form.setFieldsValue({ upazila: undefined });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 gap-4">
        <Spin size="large" />
        <Typography.Text type="secondary">Loading request data...</Typography.Text>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Back
            </Button>
            <div className="text-center flex-1">
                <Space direction="vertical" align="center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <EditOutlined style={{ fontSize: "24px", color: "#fff" }} />
                    </div>
                    <Title level={2} style={{ margin: "8px 0 0 0" }}>Edit Blood Request</Title>
                </Space>
            </div>
            <div style={{ width: 84 }}></div> {/* Spacer for symmetry */}
        </div>

        <Card className="shadow-xl rounded-2xl border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
            initialValues={request}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Recipient Name"
                  name="recipientName"
                  rules={[{ required: true, message: "Please enter recipient name" }]}
                >
                  <Input prefix={<HeartFilled className="text-red-400" />} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Blood Group"
                  name="blood_group"
                  rules={[{ required: true, message: "Please select blood group" }]}
                >
                  <Select placeholder="Select Blood Group">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <Option key={bg} value={bg}>{bg}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="District"
                  name="district"
                  rules={[{ required: true, message: "Please select district" }]}
                >
                  <Select
                    placeholder="Select District"
                    onChange={handleDistrictChange}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {districts.map((d) => (
                      <Option key={d.id} value={d.id}>{d.name}</Option>
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
                      (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {upazilas
                      .filter((u) => u.district_id === selectedDistrict)
                      .map((u) => (
                        <Option key={u.id} value={u.name}>{u.name}</Option>
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
                  rules={[{ required: true, message: "Please enter hospital name" }]}
                >
                  <Input prefix={<BankOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Address"
                  name="address"
                  rules={[{ required: true, message: "Please enter address" }]}
                >
                  <Input prefix={<EnvironmentOutlined />} />
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
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                className="bg-red-600 h-12 text-lg font-bold"
                icon={<SaveOutlined />}
              >
                Update Request
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditRequest;