import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import logo from "../images/careerfastlogofinal.png";
import "../css/NotFound.css";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const logoVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.8 },
    },
    tap: { scale: 0.95 },
  };

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="not-found-container">
      {/* Animated background elements */}
      <div className="bg-shapes">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="shape"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1.5, 0],
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div
        ref={ref}
        className="content"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        {/* Animated logo */}
        <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
          <motion.img
            src={logo}
            alt="CareerFast Logo"
            className="logo"
            variants={logoVariants}
          />
        </motion.div>

        {/* 404 text with animation */}
        <motion.h1 variants={itemVariants} className="title">
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          >
            4
          </motion.span>
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              delay: 0.2,
            }}
          >
            0
          </motion.span>
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              delay: 0.4,
            }}
          >
            4
          </motion.span>
        </motion.h1>

        <motion.p variants={itemVariants} className="subtitle">
          Oops! The page you're looking for has vanished into the digital void.
        </motion.p>

        {/* Animated SVG decoration */}
        <motion.svg
          width="200"
          height="10"
          viewBox="0 0 200 10"
          className="divider"
          variants={itemVariants}
        >
          <motion.path
            d="M0 5 Q 50 10, 100 5 T 200 5"
            stroke="#6900ad"
            strokeWidth="2"
            fill="transparent"
            variants={pathVariants}
          />
        </motion.svg>

        {/* Animated button */}
        <motion.div variants={itemVariants}>
          <a onClick={() => navigate("/job-portal")}>
            {" "}
            <motion.button
              className="home-button"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(105, 0, 173, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Return Home
            </motion.button>{" "}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
