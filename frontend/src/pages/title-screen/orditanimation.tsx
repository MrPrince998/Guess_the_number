import { motion } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

const positions: Position[] = [
  { x: 0, y: -150 }, // top
  { x: 150, y: 0 }, // right
  { x: 0, y: 150 }, // bottom
  { x: -150, y: 0 }, // left
];

export default function OrbitAnimation() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div className="relative w-[300px] h-[300px] border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
        {[1, 2, 3, 4].map((num, i) => {
          const angle = (i * Math.PI) / 2; // 90 degrees apart
          const orbitRadius = 75;

          return (
            <motion.div
              key={num}
              className="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center text-xl font-bold absolute"
              initial={{
                x: 0,
                y: 0,
              }}
              animate={{
                x: [
                  0, // Start at center
                  Math.cos(angle) * orbitRadius, // Orbit position
                  positions[i].x, // Final position
                ],
                y: [
                  0, // Start at center
                  Math.sin(angle) * orbitRadius, // Orbit position
                  positions[i].y, // Final position
                ],
              }}
              transition={{
                duration: 3,
                times: [0, 0.5, 1], // Keyframe timing
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            >
              {num}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
