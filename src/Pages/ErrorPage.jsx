import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Result, Button, Typography, Layout, ConfigProvider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  // Determine error type
  const is404 = error?.status === 404;
  const status = is404 ? "404" : "500";
  const title = is404 ? "404 - Page Not Found" : "Something Went Wrong";
  const message = is404 
    ? "Sorry, the page you visited does not exist." 
    : error?.message || "There was an error while processing your request. Please try again later.";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#dc2626",
          borderRadius: 8,
        },
      }}
    >
      <Layout className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Result
            status={status}
            title={<Title level={1} className="text-red-800">{title}</Title>}
            subTitle={<Text type="secondary" style={{ fontSize: '18px' }}>{message}</Text>}
            extra={[
              <Link to="/" key="home">
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<ArrowLeftOutlined />}
                    className="bg-red-600 rounded-full h-12 px-8 flex items-center"
                >
                  Back to Home
                </Button>
              </Link>
            ]}
          >
            <div className="text-center mt-8">
              <Paragraph type="secondary" className="mb-0">
                BloodBridge • Saving lives, one drop at a time
              </Paragraph>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                If you believe this is a technical issue, please contact support.
              </Text>
            </div>
          </Result>
        </div>
      </Layout>
    </ConfigProvider>
  );
};

const Title = Typography.Title;

export default ErrorPage;