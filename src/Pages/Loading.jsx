import React from 'react';
import { Spin, Typography, ConfigProvider } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

function Loading({ tip = "Loading..." }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#dc2626",
        },
      }}
    >
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Main Blood Drop Icon with Animation */}
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-red-500 rounded-full blur-2xl"
            />
            
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-200"
            >
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c-1.5 3.5-6 8-6 12a6 6 0 0012 0c0-4-4.5-8.5-6-12z"/>
              </svg>
            </motion.div>
          </div>

          <div className="text-center">
            <Title level={2} className="m-0 bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
              {tip}
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }} className="block mt-2">
                Every drop counts. Preparing your experience...
            </Text>
          </div>

          <Spin size="large" />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Loading;