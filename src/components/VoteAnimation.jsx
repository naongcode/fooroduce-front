import { motion } from "framer-motion";

const AnimatedImage = ({ src }) => {
  console.log('src',src);
  return (
    <motion.img
      src={src}
      className="w-10 h-10 rounded-full object-cover"
      animate={{
        scale: [1, 1.2, 1],
        boxShadow: [
          "0 0 10px #ffd700",
          "0 0 20px #ffa500",
          "0 0 10px #ffd700",
        ],
        x: [0, -2, 2, -2, 2, 0],
        y: [0, 1, -1, 1, -1, 0],
      }}
      transition={{
        duration: 2,
        repeat: 0,
      }}
      style={{
        boxShadow: "0 0 10px #ffd700",
      }}
    />
  );
};

export default AnimatedImage;
