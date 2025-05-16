import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../style/LandingAnimation.css";

export default function LandingAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 4200); // 3.5초 후에 사라짐
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="landing-wrapper">
      {/* 배경 음악 추가 */}
      <audio autoPlay loop>
        <source src="/pickme.mp3" type="audio/mp3" />
      </audio>

      <div className="fooroduce-text">
        <motion.span
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="f-red"
        >
          F
        </motion.span>
        <motion.span
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          ooroduce
        </motion.span>
      </div>

      <motion.div
        className="title-101"
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        1 0 1
      </motion.div>

      <motion.div
        className="subtext"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        당신의 트럭에 투표하세요
      </motion.div>
    </div>
  );
}
