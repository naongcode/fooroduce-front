import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../style/LandingAnimation.css";

export default function LandingAnimation() {
  // const [show, setShow] = useState(true);

  const NUM_PETALS = 40; // 벚꽃 개수
  const getRandom = (min, max) => Math.random() * (max - min) + min;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShow(false);
  //   }, 4500); // 4.5초 후에 사라짐
  //   return () => clearTimeout(timer);
  // }, []);

  // if (!show) return null;

  return (
    <div className="landing-wrapper">
      {/* 벚꽃 애니메이션 */}
      {Array.from({ length: NUM_PETALS }).map((_, i) => {
        const size = getRandom(40, 80);
        const initialX = getRandom(-window.innerWidth, window.innerWidth/2);
        const initialY = getRandom(-window.innerHeight, window.innerHeight/3);
        return (
          <motion.img
            key={i}
            src={`/sakura.png`} // public 폴더 이미지 사용
            className="petal"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            initial={{
              opacity: 1,
              x: initialX,
              y: initialY,
              rotate: getRandom(0, 360),
            }}
            animate={{
              y: window.innerHeight + 200, // 화면 아래로 떨어짐
              x: [initialX, initialX + 50, initialX - 50, initialX + 50], // 좌우 흔들림
              rotate: 360,
            }}
            transition={{
              duration: getRandom(6, 10),
              repeat: Infinity,
              ease: "linear",
              delay: getRandom(0, 4),
              repeatType: "loop",
            }}
          />
        );
      })}

      {/* 배경 음악 추가 */}
      <audio autoPlay loop>
        <source src="/pickme.mp3" type="audio/mp3" />
      </audio>

      {/* 문구 애니메이션 */}
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
