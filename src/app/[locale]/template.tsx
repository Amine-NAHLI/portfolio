"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "circOut", duration: 0.6 }}
      className="flex flex-col flex-1 w-full"
    >
      {children}
    </motion.div>
  );
}
