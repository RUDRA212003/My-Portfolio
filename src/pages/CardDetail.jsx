import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase/supabaseClient";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [previewItem, setPreviewItem] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchCardData();
  }, [id]);

  const fetchCardData = async () => {
    try {
      const [cardRes, itemsRes] = await Promise.all([
        supabase.from("cards").select("*").eq("id", id).single(),

        supabase
          .from("card_items")
          .select("*")
          .eq("card_id", id)
          .order("created_at", { ascending: false }),
      ]);

      if (cardRes.error) throw cardRes.error;
      if (itemsRes.error) throw itemsRes.error;

      setCard(cardRes.data);
      setItems(itemsRes.data || []);
    } catch (error) {
      console.error("Error fetching card data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xl text-slate-600">
        Loading...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Card not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* TOP CARD HEADER */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-12 border border-slate-200">

          {/* ⭐ SMALL HEADER IMAGE (OLD STYLE) */}
          {card.image_url && (
            <motion.img
              src={card.image_url}
              alt={card.title}
              className="w-full max-w-md h-48 object-cover rounded-lg mx-auto mb-6 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          )}

          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-slate-800 mb-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {card.title}
          </motion.h1>

          <motion.p
            className="text-lg text-blue-600 uppercase font-semibold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {card.type}
          </motion.p>
        </div>


        {/* GRID OF ITEMS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg border border-slate-200 hover:border-blue-300 overflow-hidden transition-all duration-300 cursor-pointer"

              onMouseEnter={() => {
                if (isMobile) return;
                const timer = setTimeout(() => setPreviewItem(item), 800);
                setHoverTimer(timer);
              }}
              onMouseLeave={() => {
                if (isMobile) return;
                clearTimeout(hoverTimer);
              }}

              onClick={() => {
                if (isMobile) setPreviewItem(item);
              }}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {isMobile && (
                  <p className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 text-xs rounded-md">
                    Tap to full view
                  </p>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {items.length === 0 && (
          <div className="text-center text-slate-500 py-12 bg-white/50 rounded-xl mt-12">
            No items available yet.
          </div>
        )}

        {/* ⭐ FULLSCREEN LEFT IMAGE + RIGHT TEXT MODAL */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-6 flex flex-col md:flex-row gap-6"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* LEFT SIDE IMAGE */}
                <div className="md:w-1/2 w-full flex justify-center items-center">
                  <img
                    src={previewItem.image_url}
                    alt={previewItem.title}
                    className="w-full max-h-[450px] object-contain rounded-xl"
                  />
                </div>

                {/* RIGHT SIDE TEXT */}
                <div className="md:w-1/2 w-full flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    {previewItem.title}
                  </h2>

                  <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                    {previewItem.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
