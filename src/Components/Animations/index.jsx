// Animation Components & Utilities for BloodBridge
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
} from "framer-motion";
import { useTheme } from "../../Context/ThemeContext";

// ============ ANIMATED BLOOD DROP ============
export const AnimatedBloodDrop = ({ size = 60, className = "" }) => {
  return (
    <motion.svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 60 78"
      className={className}
      initial={{ scale: 0, y: -20 }}
      animate={{
        scale: [1, 1.1, 1],
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <defs>
        <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#dc2626"
            floodOpacity="0.3"
          />
        </filter>
      </defs>
      <motion.path
        d="M30 0C30 0 0 40 0 55C0 70 13.5 78 30 78C46.5 78 60 70 60 55C60 40 30 0 30 0Z"
        fill="url(#bloodGradient)"
        filter="url(#dropShadow)"
        animate={{
          d: [
            "M30 0C30 0 0 40 0 55C0 70 13.5 78 30 78C46.5 78 60 70 60 55C60 40 30 0 30 0Z",
            "M30 0C30 0 2 42 2 55C2 68 14 76 30 76C46 76 58 68 58 55C58 42 30 0 30 0Z",
            "M30 0C30 0 0 40 0 55C0 70 13.5 78 30 78C46.5 78 60 70 60 55C60 40 30 0 30 0Z",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Shine effect */}
      <ellipse cx="20" cy="45" rx="8" ry="12" fill="rgba(255,255,255,0.3)" />
    </motion.svg>
  );
};

// ============ PULSING HEARTBEAT ============
export const PulsingHeart = ({
  size = 48,
  color = "#dc2626",
  className = "",
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      animate={{
        scale: [1, 1.2, 1, 1.15, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 1],
      }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </motion.svg>
  );
};

// ============ HEARTBEAT LINE ANIMATION ============
export const HeartbeatLine = ({
  width = 200,
  height = 60,
  color = "#dc2626",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      className="overflow-visible"
    >
      <motion.path
        d="M0 30 L40 30 L50 10 L60 50 L70 20 L80 40 L90 30 L200 30"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
};

// ============ SCROLL REVEAL WRAPPER ============
export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
    scale: { scale: 0.8 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// ============ STAGGER CHILDREN WRAPPER ============
export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// ============ ANIMATED COUNTER ============
export const AnimatedCounter = ({
  end,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ============ FLOATING ELEMENTS ============
export const FloatingElement = ({
  children,
  duration = 3,
  distance = 10,
  delay = 0,
}) => {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

// ============ RIPPLE BUTTON ============
export const RippleButton = ({
  children,
  onClick,
  className = "",
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
          animate={{ width: 300, height: 300, x: -150, y: -150, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
};

// ============ HOVER LIFT CARD ============
export const HoverLiftCard = ({
  children,
  className = "",
  liftAmount = -8,
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: liftAmount,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// ============ PAGE TRANSITION ============
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// ============ SKELETON LOADER ============
export const SkeletonLoader = ({
  width = "100%",
  height = 20,
  rounded = "md",
  className = "",
}) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`${className} rounded-${rounded}`}
      style={{
        width,
        height,
        background: isDarkMode
          ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
          : "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// ============ BLOOD CELL PARTICLES ============
export const BloodCellParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 12 + 6,
    x: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-red-500/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
          }}
          initial={{ y: "-10%", opacity: 0 }}
          animate={{
            y: "110%",
            opacity: [0, 0.6, 0.6, 0],
            x: [0, Math.sin(particle.id) * 30, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ============ GLASSMORPHISM CARD ============
export const GlassCard = ({ children, className = "", blur = "md" }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`
        backdrop-blur-${blur} 
        ${
          isDarkMode
            ? "bg-white/5 border-white/10"
            : "bg-white/70 border-white/20"
        }
        border rounded-2xl shadow-xl
        ${className}
      `}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// ============ GRADIENT MESH BACKGROUND ============
export const GradientMesh = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-red-500/30 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-10%", left: "-10%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "-10%", right: "-10%" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/20 blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "40%", right: "20%" }}
      />
    </div>
  );
};

// ============ TYPING ANIMATION ============
export const TypingText = ({ text, speed = 50, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
};

// ============ PARALLAX WRAPPER ============
export const ParallaxSection = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        setOffset(scrolled * speed * 0.1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y: offset }}>{children}</motion.div>
    </div>
  );
};

export default {
  AnimatedBloodDrop,
  PulsingHeart,
  HeartbeatLine,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  FloatingElement,
  RippleButton,
  HoverLiftCard,
  PageTransition,
  SkeletonLoader,
  BloodCellParticles,
  GlassCard,
  GradientMesh,
  TypingText,
  ParallaxSection,
};
