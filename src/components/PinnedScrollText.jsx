import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function PinnedScrollText({ html }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const paragraphs = html
    .split("</p>")
    .map(p =>
      p.replace(/<[^>]+>/g, "").trim()
    )
    .filter(Boolean);

  return (
    <section ref={ref} className="relative h-[200vh]">
      {/* PINNED CONTENT */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8">

          {paragraphs.map((text, index) => {
            const start = index / paragraphs.length;
            const end = start + 0.25;

            const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
            const y = useTransform(scrollYProgress, [start, end], [40, 0]);

            return (
              <motion.p
                key={index}
                style={{ opacity, y }}
                className="text-xl md:text-2xl text-slate-700 leading-relaxed"
              >
                {text}
              </motion.p>
            );
          })}

        </div>
      </div>
    </section>
  );
}
