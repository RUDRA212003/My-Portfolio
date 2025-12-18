import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase/supabaseClient";

export default function About() {
  const [about, setAbout] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);

  /* ---------------------------------------
     FETCH DATA
  ---------------------------------------- */
  useEffect(() => {
    fetchAbout();
    fetchHeroImage();
  }, []);

  const fetchAbout = async () => {
    const { data } = await supabase
      .from("about")
      .select("*")
      .single();
    setAbout(data);
    setLoading(false);
  };

  const fetchHeroImage = async () => {
    const { data } = await supabase
      .from("hero")
      .select("photo_url")
      .single();
    if (data?.photo_url) setHeroImage(data.photo_url);
  };

  /* ---------------------------------------
     SCROLL LOGIC (APPLE WAY)
  ---------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !about) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollable = sectionHeight - window.innerHeight;

      const progress = Math.min(
        Math.max(-rect.top / scrollable, 0),
        1
      );

      const paragraphs = getParagraphs(about.content);
      const index = Math.floor(progress * paragraphs.length);

      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [about]);

  if (loading || !about) return null;

  const paragraphs = getParagraphs(about.content);

  return (
    /* 🔒 FREEZE ZONE */
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-slate-50 via-white to-blue-50"
      style={{ height: `${paragraphs.length * 100}vh` }}
    >
      {/* 🔒 PINNED CONTENT */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* IMAGE */}
            <div className="hidden lg:flex justify-center">
              {heroImage && (
                <img
                  src={heroImage}
                  alt="Profile"
                  className="w-64 h-64 rounded-full object-cover border-4 border-blue-200 shadow-2xl"
                />
              )}
            </div>

            {/* TEXT */}
            <div className="lg:pl-8">
              <h2 className="text-5xl font-bold mb-14 text-slate-800">
                About Me
              </h2>

              <div className="space-y-10">
                {paragraphs.map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={
                      activeIndex >= index
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 40 }
                    }
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-lg md:text-xl text-slate-700 leading-relaxed"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------
   UTIL
---------------------------------------- */
function getParagraphs(html) {
  return html
    .split("</p>")
    .map(p => p.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
}
