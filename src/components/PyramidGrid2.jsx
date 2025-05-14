import { motion } from "framer-motion";
import { useState, useEffect, useRef} from "react";
import { useInView } from "framer-motion";

const PyramidGrid2 = ({ images }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true }); // 최초 한 번만 트리거
    const [startVibration, setStartVibration] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const imageCount = images.length;
    const imageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: (imageCount - 1 - i) * 0.4,
        duration: 1.2,
      },
    }),
  };


  // 진동 끝나고 카드 뒤집기 트리거
//   useEffect(() => {
//     if (startVibration) {
//         // 진동 지속시간 0.4 * repeat(2) = 0.8초 → 안전하게 1초
//         const timer = setTimeout(() => setIsFlipped(true),1000); 
//         return () => clearTimeout(timer);
//     }
//   }, [startVibration]);

  // 진동 효과 
  const vibrationVariants = {
    vibrate: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 1, -1, 1, -1, 0],
      boxShadow: [
        "0 0 0px transparent",
        "0 0 10px #ffd700",
        "0 0 20px #800080",
        "0 0 10px #ffd700",
        "0 0 20px #800080",
      ],
      transition: {
        x: { duration: 0.4, repeat: 2 },
        y: { duration: 0.4, repeat: 2 },
        boxShadow: { duration: 1.5 },
      },
    },
  };

//   console.log('컴포넌트에서 받은 images',images)

  return (
    <div
        ref={ref} 
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "40px" }}>
      
      {/* Row 1: 1위 */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          variants={imageVariants}
          onAnimationComplete={() => setStartVibration(true)}
        //   className="p-1 rounded-full border-4"
          style={{
            borderColor: startVibration ? "#800080" : "#FFD700",
            animation: startVibration ? "spin 4s linear infinite" : "none",
            display: "inline-block",
          }}
        >
          <motion.img
            src={images[0]}
            className="rounded-full object-cover"
            style={{ width: "120px", height: "120px" }}
            animate={startVibration ? "vibrate" : undefined}
            variants={vibrationVariants}
          />
        </motion.div>
      </div>

      {/* Row 2 */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div style={{ display: "flex", gap: "16px" }}>        
          {images.slice(1, 3).map((src, idx) => (
            <motion.img
                key={idx + 1}
                src={src}
                custom={idx + 1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={imageVariants}
                className="rounded-full object-cover"
                style={{ width: "100px", height: "100px" }}
            />
        ))}
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          {images.slice(3, 6).map((src, idx) => (
            <motion.img
              key={idx + 3}
              src={src}
              custom={idx + 3}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={imageVariants}
              className="rounded-full object-cover"
              style={{ width: "100px", height: "100px" }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default PyramidGrid2;
