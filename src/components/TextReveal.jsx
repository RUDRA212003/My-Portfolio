import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function TextReveal({ text }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });

  const lines = text.split("\n");

  return (
    <div ref={ref} className="space-y-4">
      {lines.map((line, i) => {
        const start = i / lines.length;
        const end = start + 0.3;

        const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
        const y = useTransform(scrollYProgress, [start, end], [30, 0]);

        return (
          <motion.p
            key={i}
            style={{ opacity, y }}
            className="text-lg md:text-xl text-slate-300 leading-relaxed"
          >
            {line}
          </motion.p>
        );
      })}
    </div>
  );
}
