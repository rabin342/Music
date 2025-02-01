"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

export const StickyScroll = ({
  content,
}: {
  content: { title: string; description: string }[];
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: ref, offset: ["start start", "end start"] });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const closestCardIndex = content.reduce((closest, _, index) => {
      const breakpoint = index / cardLength;
      return Math.abs(latest - breakpoint) < Math.abs(latest - closest)
        ? index
        : closest;
    }, 0);
    setActiveCard(closestCardIndex);
  });

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan to emerald
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink to indigo
    "linear-gradient(to bottom right, #f59e0b, #facc15)", // orange to yellow
  ];

  return (
    <motion.div
      className="h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-lg text-slate-300 max-w-sm mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        key={activeCard} // Forces re-render
        animate={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        transition={{ duration: 1 }}
        className="hidden lg:block h-60 w-80 rounded-md sticky top-10"
      ></motion.div>
    </motion.div>
  );
};
