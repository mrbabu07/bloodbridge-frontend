import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { Heart, Droplet } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Form, Input, Select, Button, Upload } from "antd";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Load districts and upazilas
  useEffect(() => {
    axios.get("/district.json").then((res) => {
      if (res.data && res.data.districts) setDistricts(res.data.districts);
    });
    axios.get("/upazila.json").then((res) => {
      if (res.data && res.data.upazilas) setUpazilas(res.data.upazilas);
    });
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      return res.data.data.display_url;
    } catch (err) {
      toast.error("Image upload failed.");
      return "";
    }
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    const { name, password, blood, district, upazila } = values;
    const email = values.email?.toLowerCase();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      let photoURL = "";
      if (fileList.length > 0) {
        photoURL = await handleImageUpload(fileList[0].originFileObj);
      }

      const userData = {
        name,
        email,
        password,
        bloodGroup: blood,
        district: districts.find((d) => d.id === district)?.name || district,
        upazila,
        photoURL,
      };

      const result = await registerUser(userData);

      if (result.success) {
        toast.success("Account created successfully! 🎉");
        navigate("/");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-red-50 via-white to-red-100"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              isDarkMode ? "text-red-900" : "text-red-200"
            } opacity-20`}
            initial={{ y: -100, x: `${i * 25}%` }}
            animate={{
              y: "110vh",
              rotate: 360,
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          >
            <Droplet size={30 + i * 8} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative z-10"
        style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-center relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            className="relative"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Heart className="text-white" size={32} fill="white" />
              </div>
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2 relative">
            Create Account
          </h2>
          <p className="text-red-100 relative">
            Join our blood donor community
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar"
        >
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label={
                <span style={{ color: theme.colors.text }}>Full Name</span>
              }
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <Input
                prefix={
                  <FaUser style={{ color: theme.colors.textSecondary }} />
                }
                placeholder="Full Name"
                className="rounded-lg h-11"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ color: theme.colors.text }}>Email</span>}
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Invalid email!" },
              ]}
            >
              <Input
                prefix={
                  <FaEnvelope style={{ color: theme.colors.textSecondary }} />
                }
                placeholder="Email Address"
                className="rounded-lg h-11"
              />
            </Form.Item>

            <Form.Item
              name="blood"
              label={
                <span style={{ color: theme.colors.text }}>Blood Group</span>
              }
              rules={[
                { required: true, message: "Please select Blood Group!" },
              ]}
            >
              <Select placeholder="Select Blood Group" className="h-11">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                  <Select.Option key={g} value={g}>
                    {g}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="district"
                label={
                  <span style={{ color: theme.colors.text }}>District</span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  placeholder="District"
                  showSearch
                  optionFilterProp="children"
                  className="h-11"
                >
                  {districts.map((d) => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.district !== currentValues.district
                }
              >
                {({ getFieldValue }) => {
                  const districtId = getFieldValue("district");
                  return (
                    <Form.Item
                      name="upazila"
                      label={
                        <span style={{ color: theme.colors.text }}>
                          Upazila
                        </span>
                      }
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Select
                        placeholder="Upazila"
                        disabled={!districtId}
                        showSearch
                        optionFilterProp="children"
                        className="h-11"
                      >
                        {upazilas
                          .filter((u) => u.district_id === districtId)
                          .map((u) => (
                            <Select.Option key={u.id} value={u.name}>
                              {u.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </div>

            <Form.Item
              name="password"
              label={<span style={{ color: theme.colors.text }}>Password</span>}
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={
                  <FaLock style={{ color: theme.colors.textSecondary }} />
                }
                placeholder="Min. 6 characters"
                className="rounded-lg h-11"
              />
            </Form.Item>

            <Form.Item
              label={
                <span style={{ color: theme.colors.text }}>
                  Profile Image (Optional)
                </span>
              }
            >
              <Upload {...uploadProps} maxCount={1} listType="picture">
                <Button icon={<FaImage />}>Select Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="bg-red-600 hover:bg-red-700 h-12 text-lg font-semibold rounded-xl"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <p style={{ color: theme.colors.textSecondary }}>
              Already have an account?{" "}
              <Button
                type="link"
                className="p-0 font-bold text-red-600"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
