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

/* -----------------------------------------
   ⭐ HEADER SKELETON
------------------------------------------ */
function HeaderSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 mb-12 border border-slate-200 animate-pulse">
      <div className="w-full max-w-md h-48 bg-slate-200 rounded-lg mx-auto mb-6"></div>
      <div className="h-8 bg-slate-200 rounded w-2/3 mx-auto mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-1/3 mx-auto"></div>
    </div>
  );
}

/* -----------------------------------------
   ⭐ GRID SKELETON
------------------------------------------ */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-pulse"
        >
          <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

export default function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [previewItem, setPreviewItem] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  const isMobile = window.innerWidth < 768;
  const isUUID = /^[0-9a-fA-F-]{36}$/.test(id);

  /* ------------------------------------------------------
     ⭐ AUTO-SCROLL TO TOP WHEN CARD OPENS
  ------------------------------------------------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  /* ------------------------------------------------------
     ⭐ FETCH CARD + ITEMS WITH 1 SEC MINIMUM SKELETON
  ------------------------------------------------------- */
  useEffect(() => {
    fetchCardData();
  }, [id]);

  const fetchCardData = async () => {
    setLoading(true);

    // Force skeleton to stay visible at least 1 second
    const minDelay = new Promise((res) => setTimeout(res, 1000));

    try {
      const cardQuery = isUUID
        ? supabase.from("cards").select("*").eq("uuid_id", id).single()
        : supabase.from("cards").select("*").eq("id", id).single();

      const itemsQuery = isUUID
        ? supabase
            .from("card_items")
            .select("*")
            .eq("card_uuid", id)
            .order("created_at", { ascending: false })
        : supabase
            .from("card_items")
            .select("*")
            .eq("card_id", id)
            .order("created_at", { ascending: false });

      const [cardRes, itemsRes] = await Promise.all([cardQuery, itemsQuery, minDelay]);

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

  /* ------------------------------------------------------
     ⭐ SHARE ITEM
  ------------------------------------------------------- */
  const handleShareItem = async (item) => {
    const itemId = item.uuid_id || item.id;
    const cardId = card?.uuid_id || card?.id;

    const url = `${window.location.origin}/card/${cardId}/item/${itemId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: "Check out this item!",
          url,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Item link copied to clipboard!");
    }
  };

  /* ------------------------------------------------------
     ⭐ SHOW SKELETON WHILE LOADING
  ------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header Skeleton */}
          <HeaderSkeleton />

          {/* Grid Skeleton */}
          <GridSkeleton />

        </div>
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

  /* ------------------------------------------------------
     ⭐ MAIN UI AFTER LOADING
  ------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* CARD HEADER */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-12 border border-slate-200">
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

        {/* ITEMS GRID */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => (
            <motion.div
              key={item.uuid_id || item.id}
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
              onClick={() => isMobile && setPreviewItem(item)}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">{item.description}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareItem(item);
                  }}
                  className="mt-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {items.length === 0 && (
          <div className="text-center text-slate-500 py-12 bg-white/50 rounded-xl mt-12">
            No items available yet.
          </div>
        )}

        {/* MODAL */}
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
                <div className="md:w-1/2 w-full flex justify-center items-center">
                  <img
                    src={previewItem.image_url}
                    alt={previewItem.title}
                    className="w-full max-h-[450px] object-contain rounded-xl"
                  />
                </div>

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
