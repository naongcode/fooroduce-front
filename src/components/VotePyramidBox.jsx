import { motion } from "framer-motion";

export default function VotePyramidBox({ truck }) {
  if (!truck) {
    return (
      <div
        className={`rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 w-10 h-10`}
      >
        없음
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center relative"
    >
      {/* 배경 효과 */}
      <div className="absolute -top-6 w-10 h-10 bg-gradient-to-b from-yellow-300 to-transparent rounded-full blur-2xl opacity-70 z-10" />

      {/* 메뉴 이미지 */}
      <img
        src={truck.menu_image}
        alt={truck.menu_name}
        className={`rounded-full object-cover border-4 w-12 h-12`} // 크기 수정
      />

      {/* 메뉴 이름 */}
      <div className="mt-2 text-center font-bold text-lg">
        {truck.menu_name}
      </div>
    </motion.div>
  );
}
