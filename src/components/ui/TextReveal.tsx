"use client";

import { motion, Variants } from "framer-motion";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: React.ElementType;
};

export default function TextReveal({ text, className = "", delay = 0, as: Component = "div" }: TextRevealProps) {
  const words = text.split(" ");
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  };
  
  const child: Variants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 16, stiffness: 100 },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionComponent = motion.create(Component as any);

  return (
    <MotionComponent
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] ${className}`}
    >
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-flex pb-2 -mb-2">
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}
