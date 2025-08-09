import { Sparkles, Triangle, Vault } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const TitleScreen = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative px-39">
      <motion.div className="w-full max-w-4xl flex flex-col items-center px-4">
        <motion.div className="flex flex-col md:flex-row items-center justify-center mb-12">
          <motion.span className="relative flex items-center justify-center">
            {/* Vault in the center */}
            <Vault
              className="h-60 w-60 text-primary-foreground"
              size={450}
              max={450}
            />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[clamp(28px,5vw,48px)] font-bold text-primary leading-14"
          >
            GUESS THE <br /> NUMBER
          </motion.h1>
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
            className="relative bg-primary text-white py-2 px-4 md:py-4 md:px-8 flex items-center justify-center gap-4 rounded-lg hover:shadow-primary/30 transition-all duration-300 backdrop-blur-sm overflow-hidden group"
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
          className="mt-12 text-sm text-muted-foreground text-center max-w-md"
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
