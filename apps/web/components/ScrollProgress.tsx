"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed left-4 top-1/2 z-50 hidden h-44 w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10 md:block">
      <motion.div
        className="h-full w-full origin-top bg-white/60"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}
