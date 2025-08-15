import { Sparkles, Triangle } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import guess_the_numberLogo from "@/assets/guess-the-number.svg";
import titleBackground from "@/assets/Lucid_Origin_Vibrant_highresolution_background_for_a_playful_n_3.jpg";

const TitleScreen = () => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center relative px-39 bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url(${titleBackground})` }}
    >
      <motion.div className="w-full max-w-4xl flex flex-col items-center px-4">
        <motion.div className="flex flex-col md:flex-row items-center justify-center">
          <motion.img
            src={guess_the_numberLogo}
            alt="Guess the Number Logo"
            className="w-7xl"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link
            to={"/main-menu"}
            className="relative text-[#bb531a] bg-[#fcef31] py-2 px-4 md:py-4 md:px-8 flex items-center justify-center gap-4 rounded-full hover:shadow-primary/30 transition-all duration-300 backdrop-blur-sm overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100"
              initial={{ x: -100 }}
              animate={{ x: 400 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              animate={{
                x: [-5, 5, -5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Triangle className="rotate-90 h-8 w-8 md:h-10 md:w-10 " />
            </motion.span>
            <h3 className="font-medium text-2xl md:text-3xl tracking-wider ">
              START GAME
            </h3>
          </Link>
        </motion.div>

        <motion.p
          className="mt-12 text-sm text-white text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            can you crack the valut's secret number?
          </motion.span>
          <AnimatePresence>
            <motion.span
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Sparkles className="text-cyan-400 animate-pulse" size={16} />
            </motion.span>
          </AnimatePresence>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default TitleScreen;
