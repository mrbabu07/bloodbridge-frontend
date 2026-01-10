// Blood-themed Loading Components
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Context/ThemeContext";

// ============ MAIN BLOOD DROP LOADER ============
export const BloodDropLoader = ({ size = "md", text = "Loading..." }) => {
  const { isDarkMode } = useTheme();

  const sizes = {
    sm: { drop: 30, text: "text-sm" },
    md: { drop: 50, text: "text-base" },
    lg: { drop: 70, text: "text-lg" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Blood drops falling */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: i * 25 - 25 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: [0, 60, 60],
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeIn",
            }}
          >
            <svg width={s.drop * 0.6} height={s.drop * 0.8} viewBox="0 0 30 40">
              <path
                d="M15 0C15 0 0 20 0 28C0 36 7 40 15 40C23 40 30 36 30 28C30 20 15 0 15 0Z"
                fill="url(#bloodGrad)"
              />
              <defs>
                <linearGradient
                  id="bloodGrad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}

        {/* Collection container */}
        <motion.div
          className="w-16 h-4 bg-gradient-to-b from-red-600 to-red-800 rounded-b-full mt-16"
          animate={{ scaleX: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </div>

      {text && (
        <motion.p
          className={`${s.text} font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// ============ HEARTBEAT LOADER ============
export const HeartbeatLoader = ({ text = "Processing..." }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-32 h-16">
        <svg viewBox="0 0 120 40" className="w-full h-full">
          <motion.path
            d="M0 20 L20 20 L25 20 L30 5 L35 35 L40 15 L45 25 L50 20 L120 20"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Pulsing heart */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#dc2626">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </div>

      {text && (
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

// ============ BLOOD CELL SPINNER ============
export const BloodCellSpinner = ({ size = 60 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-red-500 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: `0 ${size / 2}px`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 0.8, 1],
            opacity: [1, 0.3, 1],
          }}
          transition={{
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.75, repeat: Infinity, delay: i * 0.1 },
            opacity: { duration: 0.75, repeat: Infinity, delay: i * 0.1 },
          }}
          initial={{ rotate: i * 45 }}
        />
      ))}
    </div>
  );
};

// ============ FULL PAGE LOADER ============
export const FullPageLoader = ({ message = "Loading BloodBridge..." }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Logo */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(220, 38, 38, 0.3)",
              "0 0 40px rgba(220, 38, 38, 0.5)",
              "0 0 20px rgba(220, 38, 38, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        BloodBridge
      </motion.h1>

      {/* Loading Bar */}
      <div
        className={`w-48 h-1 rounded-full overflow-hidden ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Message */}
      <motion.p
        className={`mt-4 text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

// ============ SKELETON CARD ============
export const SkeletonCard = ({ lines = 3 }) => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";

  return (
    <div
      className={`p-4 rounded-xl ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg`}
    >
      {/* Avatar */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className={`w-12 h-12 rounded-full ${bgColor}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="flex-1">
          <motion.div
            className={`h-4 w-24 rounded ${bgColor} mb-2`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
          />
          <motion.div
            className={`h-3 w-16 rounded ${bgColor}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Content lines */}
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          className={`h-3 rounded ${bgColor} mb-2`}
          style={{ width: `${100 - i * 15}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 * (i + 3) }}
        />
      ))}
    </div>
  );
};

export default {
  BloodDropLoader,
  HeartbeatLoader,
  BloodCellSpinner,
  FullPageLoader,
  SkeletonCard,
};
