import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Apple-style scroll reveal
 * Works with HTML content (<p> tags from Supabase)
 */
export default function ScrollTextReveal({ html }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  // ✅ Extract paragraphs from HTML safely
  const paragraphs = html
    .split("</p>")
    .map(p =>
      p
        .replace(/<p>/g, "")
        .replace(/<[^>]+>/g, "")
        .trim()
    )
    .filter(Boolean);

  return (
    <div ref={containerRef} className="space-y-8">
      {paragraphs.map((text, index) => {
        const start = index / paragraphs.length;
        const end = start + 0.25;

        const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
        const y = useTransform(scrollYProgress, [start, end], [40, 0]);

        return (
          <motion.p
            key={index}
            style={{ opacity, y }}
            className="text-lg md:text-xl text-slate-700 leading-relaxed"
          >
            {text}
          </motion.p>
        );
      })}
    </div>
  );
}
